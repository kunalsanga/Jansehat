# JanSehat - AI Service Setup Guide

## Overview
JanSehat is a telemedicine application that uses Google's Gemini AI for symptom analysis. This guide will help you set up the AI service for both local development and production deployment.

## AI Service Configuration

### 1. Get a Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key for configuration

### 2. Local Development Setup

#### Option A: Environment Variables (Recommended)
Create a `.env` file in your project root:
```bash
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

#### Option B: Direct Configuration
Update `src/config.js`:
```javascript
export const GEMINI_API_KEY = 'your_actual_api_key_here';
```

### 3. Production Deployment (Vercel)

#### For Vercel Deployment:
1. Go to your Vercel dashboard
2. Select your JanSehat project
3. Go to Settings → Environment Variables
4. Add a new variable:
   - **Name**: `VITE_GEMINI_API_KEY`
   - **Value**: Your Gemini API key
5. Redeploy your application

## How It Works

### Client-Side AI Integration
- The app now uses client-side AI integration
- No separate server required for production
- Works on mobile devices and all platforms
- Direct connection to Google's Gemini API

### Features
- ✅ Symptom analysis and preliminary diagnosis
- ✅ Mobile-friendly interface
- ✅ Real-time AI service status
- ✅ Error handling and user guidance
- ✅ Professional medical disclaimers

## Troubleshooting

### AI Service Not Connected
If you see "AI Service Not Configured":
1. Check that your API key is correctly set
2. Verify the API key is valid and active
3. Ensure the environment variable is properly configured
4. Try refreshing the page

### Mobile Access Issues
The new client-side implementation resolves mobile connectivity issues:
- No more localhost connection problems
- Works on any device with internet access
- Direct API communication from the browser

## Security Notes
- Never commit API keys to version control
- Use environment variables for sensitive data
- The API key is exposed to the client (this is normal for client-side AI apps)
- Consider implementing rate limiting for production use

## Support
If you encounter issues:
1. Check the browser console for error messages
2. Verify your API key is active
3. Ensure you have internet connectivity
4. Check Google AI Studio for API status

---

**Important**: This application provides preliminary health guidance only. Always consult with qualified healthcare professionals for proper medical diagnosis and treatment.
