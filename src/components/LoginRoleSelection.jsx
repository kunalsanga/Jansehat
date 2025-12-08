import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// --- TRANSLATION DATA (Shared Dictionary) ---
const TRANSLATIONS = {
  en: {
    header: 'Select your role to login',
    new_user_prompt: 'New user?',
    signup_button: 'Sign up',
    roles: [
      { title: 'Patient', icon: '👤', path: '/login/patient' },
      { title: 'Asha Didi', icon: '👩‍⚕️', path: '/login/asha' },
      { title: 'Doctor', icon: '👨‍⚕️', path: '/login/doctor' },
      { title: 'Pharmacist', icon: '💊', path: '/login/pharmacist' },
    ],
    name: 'English',
    emoji: '🇬🇧',
  },
  hi: {
    header: 'लॉगिन करने के लिए अपनी भूमिका चुनें',
    new_user_prompt: 'नया उपयोगकर्ता?',
    signup_button: 'साइन अप करें',
    roles: [
      { title: 'रोगी', icon: '👤', path: '/login/patient' },
      { title: 'आशा दीदी', icon: '👩‍⚕️', path: '/login/asha' },
      { title: 'डॉक्टर', icon: '👨‍⚕️', path: '/login/doctor' },
      { title: 'फार्मासिस्ट', icon: '💊', path: '/login/pharmacist' },
    ],
    name: 'हिन्दी',
    emoji: '🇮🇳',
  },
  pa: {
    header: 'ਲਾਗਇਨ ਕਰਨ ਲਈ ਆਪਣੀ ਭੂਮਿਕਾ ਚੁਣੋ',
    new_user_prompt: 'ਨਵਾਂ ਵਰਤੋਂਕਾਰ?',
    signup_button: 'ਸਾਈਨ ਅੱਪ ਕਰੋ',
    roles: [
      { title: 'ਮਰੀਜ਼', icon: '👤', path: '/login/patient' },
      { title: 'ਆਸ਼ਾ ਦੀਦੀ', icon: '👩‍⚕️', path: '/login/asha' },
      { title: 'ਡਾਕਟਰ', icon: '👨‍⚕️', path: '/login/doctor' },
      { title: 'ਫਾਰਮਾਸਿਸਟ', icon: '💊', path: '/login/pharmacist' },
    ],
    name: 'ਪੰਜਾਬੀ',
    emoji: '🇵🇰',
  },
}
// --- END TRANSLATION DATA ---

function LoginRoleSelection() {
  const navigate = useNavigate()

  // STATE: Reads language preference from local storage or defaults to 'en'
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('appLanguage') || 'en'
  })

  // EFFECT: Saves language preference to local storage whenever the state changes
  useEffect(() => {
    localStorage.setItem('appLanguage', language)
  }, [language])

  // HANDLER: Cycles through the languages (en -> hi -> pa -> en)
  const handleLanguageChange = () => {
    const languageKeys = Object.keys(TRANSLATIONS)
    const currentIndex = languageKeys.indexOf(language)
    const nextIndex = (currentIndex + 1) % languageKeys.length
    setLanguage(languageKeys[nextIndex])
  }

  // Use the current translation object for rendering
  const t = TRANSLATIONS[language] || TRANSLATIONS.en 
  const rolesToRender = t.roles 

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative">
      
      {/* LANGUAGE BUTTON (Top Right) */}
      <button
        onClick={handleLanguageChange}
        className="absolute top-4 right-4 bg-purple-100 hover:bg-purple-200 border border-purple-300 text-purple-800 rounded-full py-2 px-4 transition-colors duration-200 flex items-center gap-2 text-sm font-medium shadow-md"
      >
        <span className="text-xl">{t.emoji}</span>
        {t.name}
      </button>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800 mb-2">
            JanSehat
          </h1>
          <p className="text-sm text-slate-600">
            {t.header}
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          {rolesToRender.map((role) => (
            <button
              key={role.path} 
              onClick={() => navigate(role.path)}
              className="w-full bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 py-3 px-4 transition-colors duration-200 flex items-center justify-center gap-3 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-slate-400"
            >
              <span className="text-lg">{role.icon}</span>
              {role.title}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-500">
            {t.new_user_prompt}{' '}
            <button 
              onClick={() => navigate('/signup')}
              className="text-slate-700 hover:text-slate-900 underline font-medium"
            >
              {t.signup_button}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginRoleSelection