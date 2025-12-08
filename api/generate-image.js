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
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ 
        error: 'Prompt is required' 
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

    const imagePrompt = `Generate a medical/healthcare related image based on this description: ${prompt}. 
    The image should be professional, medical-themed, and appropriate for a telemedicine application.`;

    const result = await model.generateContent(imagePrompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({
      success: true,
      imageDescription: text,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in image generation:', error);
    res.status(500).json({ 
      error: 'Failed to generate image. Please try again later.' 
    });
  }
}
