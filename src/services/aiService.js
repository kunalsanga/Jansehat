import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '../../config.js';

class AIService {
  constructor() {
    this.genAI = null;
    this.isConfigured = false;
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

  async analyzeSymptoms(symptoms) {
    if (!this.isConfigured) {
      throw new Error('AI service not configured. Please add a valid Gemini API key.');
    }

    if (!symptoms || symptoms.trim().length < 5) {
      throw new Error('Please provide more detail (at least 5 characters)');
    }

    const tryModel = async (modelName) => {
      const model = this.genAI.getGenerativeModel({ model: modelName });

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

      return {
        success: true,
        analysis: text,
        timestamp: new Date().toISOString()
      };

    };

    const modelCandidates = [
      "gemini-1.5-flash",
      "gemini-1.5-flash-latest",
      "gemini-1.5-flash-8b",
      "gemini-1.5-flash-8b-latest",
      "gemini-1.0-pro"
    ];

    let lastErr;
    for (const name of modelCandidates) {
      try {
        return await tryModel(name);
      } catch (e) {
        const msg = String(e?.message || e);
        lastErr = msg;
        // If it's a quota error and we have more candidates, continue to next; else keep trying
        continue;
      }
    }
    throw new Error(`Failed to analyze symptoms: ${lastErr || 'Unknown model error'}`);
  }

  async interpretVoiceCommand(transcript, options = {}) {
    if (!this.isConfigured) {
      return { action: 'UNKNOWN', confidence: 0, reason: 'AI not configured' };
    }

    if (!transcript || typeof transcript !== 'string') {
      return { action: 'UNKNOWN', confidence: 0, reason: 'Empty transcript' };
    }

    try {
      const candidates = ['gemini-1.5-flash','gemini-1.5-flash-latest','gemini-1.5-flash-8b','gemini-1.5-flash-8b-latest','gemini-1.0-pro'];
      let model;
      let lastErr;
      for (const name of candidates) {
        try {
          model = this.genAI.getGenerativeModel({ model: name });
          // quick dry-run call will happen below; if it 404s we catch and try next
          break;
        } catch (e) {
          lastErr = e;
          continue;
        }
      }
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
      return { action: 'UNKNOWN', confidence: 0, reason: 'Model error' };
    }
  }
}

// Create singleton instance
const aiService = new AIService();

export default aiService;
