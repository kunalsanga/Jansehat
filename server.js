import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { registerMapsProxy } from './api/mapsProxy.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Maps proxy routes (Google Maps Places & Directions)
registerMapsProxy(app);

// Initialize Gemini AI (fallback if Ollama not used or fails)
const genAI = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

const USE_OLLAMA_QWEN = process.env.USE_OLLAMA_QWEN === '1' || !!process.env.OLLAMA_QWEN_MODEL;
const OLLAMA_MODEL = process.env.OLLAMA_QWEN_MODEL || 'qwen2.5:latest';
const OLLAMA_URL = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';

async function runWithOllama(prompt) {
  if (!USE_OLLAMA_QWEN) return null;
  try {
    const res = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt,
        stream: false
      })
    });
    if (!res.ok) throw new Error(`Ollama responded with ${res.status}`);
    const data = await res.json();
    if (!data?.response) throw new Error('Empty Ollama response');
    return data.response;
  } catch (err) {
    console.error('Ollama Qwen2.5 failed, falling back to Gemini:', err.message);
    return null;
  }
}

// Symptom checker endpoint
app.post('/api/symptom-check', async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || symptoms.trim().length < 2) {
      return res.status(400).json({
        error: 'Please provide symptoms (at least 2 characters)'
      });
    }

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

    // Prefer local Qwen2.5 via Ollama when enabled; fallback to Gemini if configured
    let text = await runWithOllama(prompt);
    let modelSource = text ? 'ollama-qwen' : null;

    if (!text) {
      // Check if API key is configured
      if (!genAI) {
        return res.status(503).json({
          error: 'AI service not available. Please start Ollama or add a Gemini API key.',
        });
      }
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      text = response.text();
      modelSource = 'gemini';
    }

    res.json({
      success: true,
      analysis: text,
      timestamp: new Date().toISOString(),
      modelSource
    });

  } catch (error) {
    console.error('Error in symptom check:', error);
    res.status(500).json({
      error: 'Failed to analyze symptoms. Please try again later.',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, async () => {
  console.log(`🚀 Symptom Checker API running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);

  // Check Ollama connection on startup
  if (USE_OLLAMA_QWEN) {
    try {
      console.log(`🦙 Testing connection to Ollama at ${OLLAMA_URL}...`);
      const res = await fetch(`${OLLAMA_URL}/api/tags`);
      if (res.ok) {
        const data = await res.json();
        const available = data.models?.some(m => m.name.includes(OLLAMA_MODEL));
        console.log(`✅ Ollama is reachable.`);
        if (available) {
          console.log(`✅ Model '${OLLAMA_MODEL}' found and ready.`);
        } else {
          console.warn(`⚠️ Ollama connected, but model '${OLLAMA_MODEL}' not found in tags. Run 'ollama pull ${OLLAMA_MODEL}'`);
        }
      } else {
        console.warn(`⚠️ Ollama answered but returned status ${res.status}`);
      }
    } catch (err) {
      console.warn(`❌ Could not connect to Ollama at ${OLLAMA_URL}. Ensure 'ollama serve' is running.`);
      console.warn(`   Error: ${err.message}`);
    }
  }
});
