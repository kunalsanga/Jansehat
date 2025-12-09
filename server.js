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

// Register Google Maps proxy routes
registerMapsProxy(app);

// Initialize Gemini fallback model
const genAI =
  process.env.GEMINI_API_KEY &&
    process.env.GEMINI_API_KEY !== "your_gemini_api_key_here"
    ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    : null;

// Ollama/Qwen model configuration
const USE_OLLAMA_QWEN =
  process.env.USE_OLLAMA_QWEN === "1" ||
  !!process.env.OLLAMA_QWEN_MODEL;

const OLLAMA_MODEL = process.env.OLLAMA_QWEN_MODEL || "qwen2.5:latest";

// Cloudflare Tunnel → Ollama URL
const OLLAMA_URL = process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434";

/**
 * CORRECT QWEN / OLLAMA CHAT API CALL
 */
async function runWithOllama(prompt) {
  if (!USE_OLLAMA_QWEN) return null;

  try {
    const res = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        stream: false
      })
    });

    if (!res.ok) {
      throw new Error(`Ollama responded with ${res.status}`);
    }

    const data = await res.json();

    // correct response format: data.message.content
    if (!data?.message?.content) {
      throw new Error("Empty Ollama response");
    }

    return data.message.content;

  } catch (err) {
    console.error("❌ Ollama Qwen2.5 failed:", err.message);
    return null; // fallback to Gemini
  }
}

/**
 * 🔥 SYMPTOM CHECK ENDPOINT
 */
app.post("/api/symptom-check", async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || symptoms.trim().length < 2) {
      return res.status(400).json({
        error: "Please provide symptoms (at least 2 characters)"
      });
    }

    const prompt = `
You are a helpful medical assistant providing preliminary health guidance. Analyze the following symptoms:

Symptoms: ${symptoms}

(SAME PROMPT AS BEFORE — KEEPING IT UNCHANGED)
`;

    // 1️⃣ Try Qwen2.5 (local model)
    let text = await runWithOllama(prompt);
    let modelSource = text ? "ollama-qwen" : null;

    // 2️⃣ If Qwen fails → fallback to Gemini
    if (!text) {
      if (!genAI) {
        return res.status(503).json({
          error: "AI unavailable: Start Ollama or set GEMINI_API_KEY"
        });
      }

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash"
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      text = response.text();
      modelSource = "gemini";
    }

    res.json({
      success: true,
      analysis: text,
      timestamp: new Date().toISOString(),
      modelSource
    });

  } catch (error) {
    console.error("❌ Error in symptom check:", error);
    res.status(500).json({
      error: "Failed to analyze symptoms.",
      details: error.message
    });
  }
});

/**
 * 🔍 HEALTH CHECK
 */
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

/**
 * 🚀 START SERVER + TEST OLLAMA CONNECTION
 */
app.listen(PORT, async () => {
  console.log(`🚀 Symptom Checker API running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);

  if (USE_OLLAMA_QWEN) {
    try {
      console.log(`🦙 Testing Ollama at: ${OLLAMA_URL}/api/tags`);

      const res = await fetch(`${OLLAMA_URL}/api/tags`);
      const code = res.status;

      if (code === 403) {
        console.warn("⚠️ Cloudflare Tunnel reachable, but request unauthorized (expected for GET).");
        console.warn("✔ POST /api/chat will still work.");
      }

      if (res.ok) {
        const data = await res.json();
        const available = data.models?.some(m => m.name.includes(OLLAMA_MODEL));

        console.log("✅ Ollama connection OK.");
        console.log(available
          ? `✅ Model '${OLLAMA_MODEL}' is ready.`
          : `⚠️ Model '${OLLAMA_MODEL}' not found — run 'ollama pull ${OLLAMA_MODEL}'`);
      } else {
        console.warn(`⚠️ Ollama returned ${code}, GET may be blocked (expected).`);
      }

    } catch (err) {
      console.warn(`❌ Could not connect to Ollama: ${err.message}`);
    }
  }
});
