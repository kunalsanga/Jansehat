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
        this.localLLMUrl = 'http://localhost:11434/v1/chat/completions'; // Default Ollama endpoint
        this.localModel = 'qwen2.5:latest';
    }

    initializeAI() {
        // Check for presence of a key starting with AIzaSy (basic validation)
        if (GEMINI_API_KEY && GEMINI_API_KEY.startsWith('AIzaSy')) {
            try {
                this.genAI = new GoogleGenerativeAI(GEMNI_API_KEY);
                this.isConfigured = true;
            } catch (error) {
                console.error('Failed to initialize Gemini AI:', error);
                this.isConfigured = false;
            }
        } else {
            // If the key is missing or is the placeholder, configuration fails
            this.isConfigured = false;
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
            { name: "gemini-2.5-flash-lite", priority: 1, maxRpm: 15 },
            { name: "gemini-2.0-flash-lite", priority: 2, maxRpm: 30 },
            { name: "gemini-2.0-flash", priority: 3, maxRpm: 15 },
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

    // NEW: Local LLM Support (Ollama / Qwen)
    async analyzeSymptomsLocal(messages, onChunk = null) {
        try {
            const isStreaming = typeof onChunk === 'function';

            const response = await fetch(this.localLLMUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: this.localModel,
                    messages: messages,
                    stream: isStreaming
                }),
            });

            if (!response.ok) {
                throw new Error(`Local LLM Error: ${response.statusText}`);
            }

            if (isStreaming) {
                const reader = response.body.getReader();
                const decoder = new TextDecoder("utf-8");
                let fullResponse = "";

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split("\n").filter(line => line.trim() !== "");

                    for (const line of lines) {
                        if (line.trim() === "data: [DONE]") continue;

                        if (line.startsWith("data: ")) {
                            try {
                                const json = JSON.parse(line.substring(6));
                                const content = json.choices?.[0]?.delta?.content || "";
                                if (content) {
                                    fullResponse += content;
                                    onChunk(content);
                                }
                            } catch (e) {
                                console.warn("Error parsing stream chunk", e);
                            }
                        }
                    }
                }

                return {
                    success: true,
                    analysis: fullResponse,
                    timestamp: new Date().toISOString()
                };
            } else {
                // Non-streaming fallback
                const data = await response.json();
                return {
                    success: true,
                    analysis: data.choices[0].message.content,
                    timestamp: new Date().toISOString()
                };
            }
        } catch (error) {
            console.error('Local LLM failed:', error);
            throw error;
        }
    }

    // OLD: Gemini API Support (preserved for fallback/compatibility)
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

            // If it's a quota error, return fallback response instead of throwing
            if (this.isQuotaError(e)) {
                console.warn(`API quota exceeded for ${bestModel}, returning fallback response:`, msg);
                return this.getFallbackResponse(symptoms);
            }

            // For other errors, try fallback response
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

        // Declare outside try/catch scope
        let bestModel = 'unknown';

        try {
            // Apply rate limiting for voice commands too
            await this.waitForRateLimit();

            bestModel = this.getBestAvailableModel(); // Assigned inside try block
            console.log(`Using model for voice command: ${bestModel}`);

            const model = this.genAI.getGenerativeModel({ model: bestModel });
            const locale = options.locale || 'auto';
            // Removed nowPathHints as it's unused in the prompt

            const prompt = `
You are an intent classification engine for a healthcare web app. Your task is to listen to the user and output a STRICT JSON object.

Rules:
1. Identify the user's **primary language** (e.g., English, Hindi, Punjabi).
2. Interpret the intent and map it to one of these actions: OPEN_HOME, OPEN_HEALTH_RECORDS, OPEN_EMERGENCY, OPEN_SYMPTOM_CHECKER, OPEN_VIDEO_CONSULTATION, OPEN_MEDICINE, OPEN_NAVIGATION, CHAT, UNKNOWN.
3. Generate a natural, friendly "responseText" in the **SAME language** as the user.
4. Return **ONLY** the JSON object. Do not include markdown fences (e.g., \`\`\`).

JSON schema:
{
  "action": "String (one of the actions above)",
  "confidence": Number, // 0-1
  "detectedLanguage": "String (Language Name, e.g., English, Hindi)",
  "responseText": "String (The spoken response)"
}

Context: User locale: ${locale}. App Features: Health Records, Emergency SOS, Symptom Checker, Video Consult, Medicine Finder, Hospital Nav.

User said: "${transcript}"
`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            let text = response.text().trim(); // Trim whitespace

            // Debug log
            console.log('AI Raw Response:', text);

            this.trackModelUsage(bestModel, true);

            let parsed;
            try {
                // FIX: Aggressively remove markdown fences (```json, ```) for robust parsing
                const cleanedText = text.replace(/```json|```/g, '').trim();
                parsed = JSON.parse(cleanedText);
            } catch (e) {
                console.error('JSON Parsing Failed:', e);
                // Fallback to salvage JSON if badly formatted (finds first { to last })
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
            }

            if (!parsed || !parsed.action) {
                return { action: 'UNKNOWN', confidence: 0, reason: 'Unparseable response', raw: text };
            }

            // Simple validation check to ensure necessary fields exist
            if (!parsed.detectedLanguage || !parsed.responseText || typeof parsed.confidence !== 'number') {
                parsed.confidence = 0.5; // Default confidence if missing
                parsed.reason = 'Missing required fields in parsed JSON';
            }

            return parsed;
        } catch (error) {
            console.error('API Call Failed:', error.message);
            this.trackModelUsage(bestModel, false);
            return { action: 'UNKNOWN', confidence: 0, reason: 'Model error' };
        }
    }
}

// Create singleton instance
const aiService = new AIService();

export default aiService