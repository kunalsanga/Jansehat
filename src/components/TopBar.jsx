import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

function TopBar() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  const changeLang = (lng) => i18n.changeLanguage(lng)

  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200 supports-[backdrop-filter]:bg-white/60">
      <div className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 overflow-hidden rounded-lg shadow-sm border border-zinc-100 group-hover:shadow-md transition-shadow">
            <img
              src="/logo.jpg"
              alt="App Logo"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-brand-600 to-teal-600 bg-clip-text text-transparent leading-none">
              {t('appName')}
            </span>
            <span className="text-[10px] sm:text-xs text-zinc-500 font-medium tracking-wide">
              {/* Optional Tagline or Role Indicator */}
              HEALTHCARE
            </span>
          </div>
        </button>

        <div className="flex items-center gap-2 bg-zinc-100/50 p-1 rounded-lg border border-zinc-200/50">
          <LanguageButton lang="en" label="EN" current={i18n.language} onClick={changeLang} />
          <LanguageButton lang="hi" label="हिं" current={i18n.language} onClick={changeLang} />
          <LanguageButton lang="pa" label="ਪੰ" current={i18n.language} onClick={changeLang} />
        </div>
      </div>
    </div>
  )
}

function LanguageButton({ lang, label, current, onClick }) {
  const isActive = current === lang
  return (
    <button
      onClick={() => onClick(lang)}
      className={`
        px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all duration-200
        ${isActive
          ? 'bg-white text-brand-700 shadow-sm ring-1 ring-zinc-200'
          : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100'
        }
      `}
    >
      {label}
    </button>
  )
}

export default TopBar;