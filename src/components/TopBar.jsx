import { useTranslation } from 'react-i18next'

function TopBar() {
  const { t, i18n } = useTranslation()
  const changeLang = (lng) => i18n.changeLanguage(lng)
  return (
    <div className="sticky top-0 z-20 bg-gradient-to-b from-white/90 to-white/70 backdrop-blur border-b border-zinc-200/70">
      <div className="w-full max-w-9xl mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 3xl:px-12 py-2 sm:py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <img 
            src="/jansehat-favicon.svg" 
            alt="JanSehat Logo" 
            className="w-6 h-6 sm:w-7 sm:h-7"
            loading="eager"
            decoding="async"
            width="28"
            height="28"
          />
          <div className="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {t('appName')}
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <button onClick={() => changeLang('en')} className={`px-2 py-1 rounded text-xs border ${i18n.language==='en'?'bg-blue-50 border-blue-300':'border-zinc-300'}`}>EN</button>
          <button onClick={() => changeLang('hi')} className={`px-2 py-1 rounded text-xs border ${i18n.language==='hi'?'bg-blue-50 border-blue-300':'border-zinc-300'}`}>हिं</button>
          <button onClick={() => changeLang('pa')} className={`px-2 py-1 rounded text-xs border ${i18n.language==='pa'?'bg-blue-50 border-blue-300':'border-zinc-300'}`}>ਪੰ</button>
        </div>
      </div>
    </div>
  )
}

  export default TopBar; 