import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '../config.js';

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
    return {
      status: this.isConfigured ? 'OK' : 'ERROR',
      configured: this.isConfigured,
      timestamp: new Date().toISOString()
    };
  }

  async analyzeSymptoms(symptoms) {
    if (!this.isConfigured) {
      throw new Error('AI service not configured. Please add a valid Gemini API key.');
    }

    if (!symptoms || symptoms.trim().length < 10) {
      throw new Error('Please provide detailed symptoms (at least 10 characters)');
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

    } catch (error) {
      console.error('Error in symptom analysis:', error);
      throw new Error('Failed to analyze symptoms. Please try again later.');
    }
  }
}

// Create singleton instance
const aiService = new AIService();

export default aiService;
