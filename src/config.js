// 💠 GEMINI API KEY
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';


// 💠 BACKEND API BASE URL
// (Render backend: https://jansehat.onrender.com)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';


// 💠 Detect development mode
export const IS_DEVELOPMENT = import.meta.env.DEV;


// 💠 Get backend API URL dynamically
export const getApiBaseUrl = () => {

    // 1️⃣ If Vercel env variable exists — always use it
    if (import.meta.env.VITE_API_BASE_URL) {
        return import.meta.env.VITE_API_BASE_URL;
    }

    // 2️⃣ In local development → always use localhost backend
    if (IS_DEVELOPMENT) {
        return "http://localhost:3001";
    }

    // 3️⃣ Fallback for browser (should not be used in production)
    if (typeof window !== 'undefined') {
        const protocol = window.location.protocol;
        const hostname = window.location.hostname;
        return `${protocol}//${hostname}`;
    }

    // 4️⃣ Default fallback
    return API_BASE_URL;
};
