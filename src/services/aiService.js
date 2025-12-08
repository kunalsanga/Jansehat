import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY, getApiBaseUrl } from '../../config.js';

class AIService {
  constructor() {
    this.genAI = null;
    this.isConfigured = false;
    this.requestQueue = [];
    this.isProcessing = false;
    this.lastRequestTime = 0;
    this.minRequestInterval = 3000; // 3 seconds between requests (increased for quota management)
    this.modelUsage = new Map(); // Track model usage for smart selection
    this.initializeAI();
  }

  initializeAI() {
    if (GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key_here') {
      try {
        this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        this.isConfigured = true;
      } catch (error) {
        console.error('Failed to initialize Gemini AI:', error);
        this.isConfigured = false;
      }
    }
  }

  async checkHealth() {
    const keyTail = typeof import.meta?.env?.VITE_GEMINI_API_KEY === 'string'
      ? import.meta.env.VITE_GEMINI_API_KEY.slice(-6)
      : undefined;
    return {
      status: this.isConfigured ? 'OK' : 'ERROR',
      configured: this.isConfigured,
      keyTail,
      timestamp: new Date().toISOString()
    };
  }

  // Rate limiting helper with smart model selection
  async waitForRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.minRequestInterval) {
      const waitTime = this.minRequestInterval - timeSinceLastRequest;
      console.log(`Rate limiting: waiting ${waitTime}ms before next request`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
  }

  // Track model usage for smart selection
  trackModelUsage(modelName, success) {
    if (!this.modelUsage.has(modelName)) {
      this.modelUsage.set(modelName, { requests: 0, failures: 0, lastUsed: 0 });
    }
    
    const usage = this.modelUsage.get(modelName);
    usage.requests++;
    usage.lastUsed = Date.now();
    
    if (!success) {
      usage.failures++;
    }
  }

  // Get best available model based on usage patterns
  getBestAvailableModel() {
    const models = [
      { name: "gemini-2.0-flash-lite", priority: 1, maxRpm: 30 },
      { name: "gemini-2.0-flash", priority: 2, maxRpm: 15 },
      { name: "gemini-2.5-flash-lite", priority: 3, maxRpm: 15 }
    ];

    // Sort by priority (lower is better) and recent failures
    return models.sort((a, b) => {
      const aUsage = this.modelUsage.get(a.name) || { failures: 0, lastUsed: 0 };
      const bUsage = this.modelUsage.get(b.name) || { failures: 0, lastUsed: 0 };
      
      // Prefer models with fewer recent failures
      if (aUsage.failures !== bUsage.failures) {
        return aUsage.failures - bUsage.failures;
      }
      
      return a.priority - b.priority;
    })[0].name;
  }

  // Check if error is quota-related
  isQuotaError(error) {
    const errorMessage = String(error?.message || error).toLowerCase();
    return errorMessage.includes('quota') || 
           errorMessage.includes('rate_limit') || 
           errorMessage.includes('429') ||
           errorMessage.includes('quota exceeded');
  }

  // Fallback response when API is unavailable
  getFallbackResponse(symptoms) {
    return {
      success: true,
      analysis: `**PRELIMINARY HEALTH GUIDANCE**

**SYMPTOMS REPORTED:**
${symptoms}

**IMPORTANT NOTICE:**
Our AI analysis service is currently experiencing high demand. While we work to restore full functionality, please consider the following:

**GENERAL RECOMMENDATIONS:**
- Monitor your symptoms closely
- Stay hydrated and get adequate rest
- Keep track of symptom severity and duration
- Note any new or worsening symptoms

**WHEN TO SEEK IMMEDIATE CARE:**
- Severe pain or discomfort
- Difficulty breathing
- High fever (over 101°F/38.3°C)
- Signs of dehydration
- Any symptom that concerns you

**NEXT STEPS:**
1. Try the symptom checker again in a few minutes
2. Contact your healthcare provider if symptoms persist or worsen
3. Use our emergency mode for urgent situations
4. Consider scheduling a video consultation

**DISCLAIMER:**
This is general guidance only. Always consult with qualified healthcare professionals for proper medical diagnosis and treatment.

*Please try again in a few minutes for AI-powered analysis.*`,
      timestamp: new Date().toISOString(),
      isFallback: true
    };
  }

  async analyzeSymptoms(symptoms) {
    if (!symptoms || symptoms.trim().length < 2) {
      throw new Error('Please provide more detail (at least 2 characters)');
    }

    const apiBase = getApiBaseUrl();

    // Try backend (Ollama Qwen or Gemini fallback)
    try {
      const res = await fetch(`${apiBase}/api/symptom-check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms })
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Backend error');
      }
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Backend error');
      return {
        success: true,
        analysis: data.analysis,
        timestamp: data.timestamp || new Date().toISOString(),
        modelSource: data.modelSource || 'backend'
      };
    } catch (e) {
      console.error('Backend symptom check failed, trying client Gemini if available:', e);
    }

    // Client-side Gemini fallback (if configured)
    if (!this.isConfigured) {
      throw new Error('AI service not configured. Please add a valid Gemini API key.');
    }

    // Apply rate limiting
    await this.waitForRateLimit();

    const bestModel = this.getBestAvailableModel();
    console.log(`Using model: ${bestModel}`);
    
    try {
      const model = this.genAI.getGenerativeModel({ model: bestModel });
      const prompt = `
You are a helpful medical assistant providing preliminary health guidance. Analyze the following symptoms:

Symptoms: ${symptoms}

Please provide a structured analysis in the following format:

**POSSIBLE CONDITIONS:**
[List 2-3 most likely conditions based on symptoms]

**URGENCY LEVEL:**
[Low/Medium/High - based on symptom severity]

**RECOMMENDED ACTIONS:**
[Specific next steps the patient should take]

**WHEN TO SEEK IMMEDIATE CARE:**
[Warning signs that require urgent medical attention]

**GENERAL ADVICE:**
[General health recommendations]

IMPORTANT DISCLAIMERS:
- This is preliminary guidance only
- Not a substitute for professional medical diagnosis
- Always consult with qualified healthcare professionals
- Seek immediate medical care for severe or worsening symptoms
- This analysis is for educational purposes only

Keep the response concise, clear, and professional. Focus on practical guidance while emphasizing the need for professional medical consultation.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      this.trackModelUsage(bestModel, true);
      return {
        success: true,
        analysis: text,
        timestamp: new Date().toISOString(),
        modelSource: 'gemini-client'
      };
    } catch (e) {
      const msg = String(e?.message || e);
      this.trackModelUsage(bestModel, false);
      
      if (this.isQuotaError(e)) {
        console.warn(`API quota exceeded for ${bestModel}, returning fallback response:`, msg);
        return this.getFallbackResponse(symptoms);
      }
      
      console.error(`Model ${bestModel} failed:`, msg);
      return this.getFallbackResponse(symptoms);
    }
  }

  async interpretVoiceCommand(transcript, options = {}) {
    if (!this.isConfigured) {
      return { action: 'UNKNOWN', confidence: 0, reason: 'AI not configured' };
    }

    if (!transcript || typeof transcript !== 'string') {
      return { action: 'UNKNOWN', confidence: 0, reason: 'Empty transcript' };
    }

    try {
      // Apply rate limiting for voice commands too
      await this.waitForRateLimit();
      
      const bestModel = this.getBestAvailableModel();
      console.log(`Using model for voice command: ${bestModel}`);
      
      const model = this.genAI.getGenerativeModel({ model: bestModel });
      const locale = options.locale || 'auto';
      const nowPathHints = ['/records','/symptoms','/video','/emergency','/medicine','/navigation'];

      const prompt = `
You are an intent classification engine for a healthcare web app. Your task is to read the user's spoken command and output a STRICT JSON object describing the app action.

Rules:
- The user may speak in ANY language. Detect the language and interpret intent.
- Map the command to one of these actions exactly:
  OPEN_HOME, OPEN_HEALTH_RECORDS, OPEN_EMERGENCY, OPEN_SYMPTOM_CHECKER, OPEN_VIDEO_CONSULTATION, OPEN_MEDICINE, OPEN_NAVIGATION, UNKNOWN
- Include optional parameters when relevant (e.g., destination for navigation, medicine name, etc.).
- Return ONLY JSON. No markdown, no explanation.

JSON schema:
{
  "action": "OPEN_HOME | OPEN_HEALTH_RECORDS | OPEN_EMERGENCY | OPEN_SYMPTOM_CHECKER | OPEN_VIDEO_CONSULTATION | OPEN_MEDICINE | OPEN_NAVIGATION | UNKNOWN",
  "confidence": 0.0, // 0-1
  "parameters": { "medicine": string | undefined, "destination": string | undefined },
  "detectedLanguage": string,
  "responseText": string // Response in the same language as user input
}

Context:
- Available routes: ${nowPathHints.join(', ')}
- User locale preference: ${locale}

User said: "${transcript}"
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      this.trackModelUsage(bestModel, true);

      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch (e) {
        // Try to salvage JSON if the model added code fences accidentally
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
      }

      if (!parsed || !parsed.action) {
        return { action: 'UNKNOWN', confidence: 0, reason: 'Unparseable response', raw: text };
      }

      return parsed;
    } catch (error) {
      console.error('Error interpreting voice command:', error);
      this.trackModelUsage(bestModel, false);
      return { action: 'UNKNOWN', confidence: 0, reason: 'Model error' };
    }
  }
}

// Create singleton instance
const aiService = new AIService();

export default aiService;
