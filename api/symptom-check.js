import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    const { symptoms } = req.body;

    if (!symptoms || symptoms.trim().length < 10) {
      return res.status(400).json({ 
        error: 'Please provide more detailed symptoms (at least 10 characters)' 
      });
    }

    // Initialize Gemini AI
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return res.status(500).json({ 
        error: 'Gemini API key not configured' 
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `As a medical AI assistant, analyze these symptoms and provide a preliminary assessment. Please be helpful but always remind the user to consult with a healthcare professional for proper diagnosis.

Symptoms: ${symptoms}

Please provide:
1. Possible conditions (list 2-3 most likely)
2. Recommended next steps
3. When to seek immediate medical attention
4. General health advice

Format your response in a clear, structured way.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({
      success: true,
      analysis: text,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in symptom check:', error);
    res.status(500).json({ 
      error: 'Failed to analyze symptoms. Please try again later.' 
    });
  }
}
