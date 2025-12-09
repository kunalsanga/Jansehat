import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY, getApiBaseUrl } from '../../config.js';

class AIService {
    constructor() {
        this.genAI = null;
        this.isConfigured = false;
        this.requestQueue = [];
        this.isProcessing = false;
        this.lastRequestTime = 0;
        this.minRequestInterval = 3000; // 3 seconds
        this.modelUsage = new Map();

        this.initializeAI();

        // IMPORTANT FIX — Use Vercel env, not localhost
        this.localLLMUrl = import.meta.env.VITE_LOCAL_LLM_URL;
        this.localModel = 'qwen2.5:latest';
    }

    initializeAI() {
        if (GEMINI_API_KEY && GEMINI_API_KEY.startsWith('AIzaSy')) {
            try {
                // IMPORTANT FIX — you had a typo GEMNI_API_KEY
                this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
                this.isConfigured = true;
            } catch (error) {
                console.error('Failed to initialize Gemini AI:', error);
                this.isConfigured = false;
            }
        } else {
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

    // Rate limiting helper
    async waitForRateLimit() {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;

        if (timeSinceLastRequest < this.minRequestInterval) {
            const waitTime = this.minRequestInterval - timeSinceLastRequest;
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
        this.lastRequestTime = Date.now();
    }

    trackModelUsage(modelName, success) {
        if (!this.modelUsage.has(modelName)) {
            this.modelUsage.set(modelName, { requests: 0, failures: 0, lastUsed: 0 });
        }

        const usage = this.modelUsage.get(modelName);
        usage.requests++;
        usage.lastUsed = Date.now();
        if (!success) usage.failures++;
    }

    getBestAvailableModel() {
        const models = [
            { name: "gemini-2.5-flash-lite", priority: 1 },
            { name: "gemini-2.0-flash-lite", priority: 2 },
            { name: "gemini-2.0-flash", priority: 3 },
        ];

        return models.sort((a, b) => {
            const aUsage = this.modelUsage.get(a.name) || { failures: 0 };
            const bUsage = this.modelUsage.get(b.name) || { failures: 0 };
            if (aUsage.failures !== bUsage.failures) return aUsage.failures - bUsage.failures;
            return a.priority - b.priority;
        })[0].name;
    }

    isQuotaError(error) {
        const msg = String(error?.message || error).toLowerCase();
        return msg.includes('quota') ||
            msg.includes('rate_limit') ||
            msg.includes('429') ||
            msg.includes('quota exceeded');
    }

    getFallbackResponse(symptoms) {
        return {
            success: true,
            analysis: `**PRELIMINARY HEALTH GUIDANCE**

**Symptoms Reported:**
${symptoms}

Our AI is temporarily unavailable. Here is basic guidance:

- Rest and hydration recommended
- Monitor severity closely
- Seek care if symptoms worsen
- High fever, breathing difficulty, or severe pain → get urgent help

This is not medical advice; consult a doctor.`,
            timestamp: new Date().toISOString(),
            isFallback: true
        };
    }

    // FIXED — Cloudflare tunnel local LLM support
    async analyzeSymptomsLocal(messages, onChunk = null) {
        try {
            const isStreaming = typeof onChunk === 'function';

            const response = await fetch(this.localLLMUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: this.localModel,
                    messages,
                    stream: isStreaming
                }),
            });

            if (!response.ok) {
                throw new Error(`Local LLM Error: ${response.statusText}`);
            }

            if (!isStreaming) {
                const data = await response.json();
                return {
                    success: true,
                    analysis: data.choices[0].message.content,
                    timestamp: new Date().toISOString()
                };
            }

            // Streaming
            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let fullResponse = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split("\n").filter(l => l.trim() !== "");

                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        const json = JSON.parse(line.substring(6));
                        const content = json.choices?.[0]?.delta?.content || "";
                        if (content) {
                            fullResponse += content;
                            onChunk(content);
                        }
                    }
                }
            }

            return {
                success: true,
                analysis: fullResponse,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error("Local LLM failed:", error);
            throw error;
        }
    }

    // Main symptom checker
    async analyzeSymptoms(symptoms) {
        if (!symptoms || symptoms.trim().length < 2) {
            throw new Error("Please provide more detail.");
        }

        const apiBase = getApiBaseUrl();

        // Try backend first
        try {
            const res = await fetch(`${apiBase}/api/symptom-check`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ symptoms })
            });

            if (!res.ok) throw new Error(await res.text());

            return await res.json();
        } catch (err) {
            console.error("Backend failed, trying Gemini:", err);
        }

        // Client-side Gemini fallback
        if (!this.isConfigured) {
            throw new Error("AI not configured.");
        }

        await this.waitForRateLimit();

        const bestModel = this.getBestAvailableModel();

        try {
            const model = this.genAI.getGenerativeModel({ model: bestModel });

            const prompt = `
Analyze the symptoms: ${symptoms}
Provide:
- Possible conditions
- Urgency level
- Recommended actions
- When to seek urgent care
- Disclaimer`;

            const result = await model.generateContent(prompt);
            const text = result.response.text();

            this.trackModelUsage(bestModel, true);

            return {
                success: true,
                analysis: text,
                timestamp: new Date().toISOString(),
                modelSource: "gemini-client"
            };

        } catch (e) {
            this.trackModelUsage(bestModel, false);

            if (this.isQuotaError(e)) {
                return this.getFallbackResponse(symptoms);
            }

            return this.getFallbackResponse(symptoms);
        }
    }
}

const aiService = new AIService();
export default aiService;
