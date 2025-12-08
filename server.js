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

// Initialize Gemini AI
const genAI = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here' 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// Symptom checker endpoint
app.post('/api/symptom-check', async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || symptoms.trim().length < 10) {
      return res.status(400).json({ 
        error: 'Please provide detailed symptoms (at least 10 characters)' 
      });
    }

    // Check if API key is configured
    if (!genAI) {
      return res.status(400).json({
        error: 'AI service not configured. Please add a valid Gemini API key to the .env file.',
        details: 'Get your free API key from https://aistudio.google.com/'
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

    res.json({
      success: true,
      analysis: text,
      timestamp: new Date().toISOString()
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

app.listen(PORT, () => {
  console.log(`🚀 Symptom Checker API running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
});
