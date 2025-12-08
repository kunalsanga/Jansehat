import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// --- TRANSLATION DATA (Shared Dictionary) ---
// Note: This must be kept entirely from the i18n-integration branch.
const TRANSLATIONS = {
    en: {
        header: 'Choose your account type to continue', // Updated text to fit the new design
        new_user_prompt: 'New to JanSehat?',
        signup_button: 'Create an account',
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
        header: 'जारी रखने के लिए अपना खाता प्रकार चुनें',
        new_user_prompt: 'जनसेहत में नए हैं?',
        signup_button: 'एक खाता बनाएं',
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
        header: 'ਜਾਰੀ ਰੱਖਣ ਲਈ ਆਪਣਾ ਖਾਤਾ ਕਿਸਮ ਚੁਣੋ',
        new_user_prompt: 'ਜਨਸਿਹਤ ਵਿੱਚ ਨਵੇਂ ਹੋ?',
        signup_button: 'ਇੱਕ ਖਾਤਾ ਬਣਾਓ',
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

    // KEEP i18n logic: STATE (Reads language preference from local storage)
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('appLanguage') || 'en'
    })

    // KEEP i18n logic: EFFECT (Saves language preference to local storage)
    useEffect(() => {
        localStorage.setItem('appLanguage', language)
    }, [language])

    // KEEP i18n logic: HANDLER (Cycles through the languages)
    const handleLanguageChange = () => {
        const languageKeys = Object.keys(TRANSLATIONS)
        const currentIndex = languageKeys.indexOf(language)
        const nextIndex = (currentIndex + 1) % languageKeys.length
        setLanguage(languageKeys[nextIndex])
    }

    // Use the current translation object for rendering
    const t = TRANSLATIONS[language] || TRANSLATIONS.en
    const rolesToRender = t.roles // Get the translated role list

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 sm:p-6 font-sans text-zinc-900 relative">

            {/* LANGUAGE BUTTON (Kept from i18n branch, moved to top of JSX) */}
            <button
                onClick={handleLanguageChange}
                className="absolute top-4 right-4 bg-purple-100 hover:bg-purple-200 border border-purple-300 text-purple-800 rounded-full py-2 px-4 transition-colors duration-200 flex items-center gap-2 text-sm font-medium shadow-md"
            >
                <span className="text-xl">{t.emoji}</span>
                {t.name}
            </button>

            <div className="w-full max-w-2xl">
                {/* Header - Minimal & Centered */}
                <div className="text-center mb-12 sm:mb-16">
                    <div className="inline-block p-1 rounded-2xl mb-6">
                        <img src="/logo.jpg" alt="JanSehat Logo" className="w-20 h-20 object-contain mx-auto" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3 text-zinc-900">
                        JanSehat
                    </h1>
                    <p className="text-zinc-500 text-lg">
                        {/* TRANSLATED HEADER */}
                        {t.header}
                    </p>
                </div>

                {/* Role Grid - Clean, Outline Style */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                    {/* Use rolesToRender which comes from the translated object */}
                    {rolesToRender.map((role) => (
                        <button
                            key={role.path} // Changed key to path for stability
                            onClick={() => navigate(role.path)}
                            className="group flex items-center p-4 rounded-xl border border-zinc-200 bg-white hover:border-zinc-400 hover:bg-zinc-50 transition-all duration-200 ease-out text-left"
                        >
                            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-2xl mr-4 group-hover:bg-white group-hover:shadow-sm transition-all">
                                {role.icon}
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-zinc-900 group-hover:text-black">
                                    {role.title} {/* TRANSLATED ROLE TITLE */}
                                </h3>
                                <span className="text-xs text-zinc-400 group-hover:text-zinc-600">Log in</span>
                            </div>
                            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400">
                                →
                            </div>
                        </button>
                    ))}
                </div>

                {/* Footer - Subtle */}
                <div className="mt-16 text-center">
                    <p className="text-sm text-zinc-500">
                        {/* TRANSLATED FOOTER PROMPT */}
                        {t.new_user_prompt}{' '}
                        <button
                            onClick={() => navigate('/signup')}
                            className="text-black font-semibold hover:underline underline-offset-4"
                        >
                            {t.signup_button} {/* TRANSLATED SIGN UP BUTTON */}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginRoleSelection