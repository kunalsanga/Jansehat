// Configuration for Gemini AI
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'your_gemini_api_key_here';

// API Configuration - Use environment variable or default to empty for client-side API calls
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Check if we're in development mode
export const IS_DEVELOPMENT = import.meta.env.DEV;

// Get the current host for dynamic API URL
export const getApiBaseUrl = () => {
    if (typeof window !== 'undefined') {
        // Client-side: use current host
        const protocol = window.location.protocol;
        const hostname = window.location.hostname;
        const port = IS_DEVELOPMENT ? ':3001' : '';
        return `${protocol}//${hostname}${port}`;
    }
    return API_BASE_URL;
};
