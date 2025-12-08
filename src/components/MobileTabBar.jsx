import React from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

function MobileTabBar() {
  const { t } = useTranslation()
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-t border-zinc-200 lg:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="grid grid-cols-5 text-xs pb-2">
        <NavLink
          to="/home"
          end
          className={({ isActive }) => `px-1 py-3 text-center flex flex-col items-center gap-1 transition-colors mobile-touch-target ${isActive ? 'text-blue-600' : 'text-zinc-500'}`}
        >
          <span className="text-sm">🏠</span>
          <span className="text-xs">{t('common.home')}</span>
        </NavLink>
        <NavLink
          to="/symptoms"
          className={({ isActive }) => `px-1 py-3 text-center flex flex-col items-center gap-1 transition-colors mobile-touch-target ${isActive ? 'text-blue-600' : 'text-zinc-500'}`}
        >
          <span className="text-sm">🩺</span>
          <span className="text-xs">{t('common.symptoms')}</span>
        </NavLink>
        <NavLink
          to="/video"
          className={({ isActive }) => `px-1 py-3 text-center flex flex-col items-center gap-1 transition-colors mobile-touch-target ${isActive ? 'text-blue-600' : 'text-zinc-500'}`}
        >
          <span className="text-sm">📹</span>
          <span className="text-xs">{t('common.video')}</span>
        </NavLink>
        <NavLink
          to="/emergency"
          className={({ isActive }) => `px-1 py-2 sm:py-3 text-center flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-red-600' : 'text-zinc-500'}`}
        >
          <span className="text-sm">🚨</span>
          <span className="text-xs">{t('common.emergency')}</span>
        </NavLink>
        <NavLink
          to="/medicine"
          className={({ isActive }) => `px-1 py-3 text-center flex flex-col items-center gap-1 transition-colors mobile-touch-target ${isActive ? 'text-blue-600' : 'text-zinc-500'}`}
        >
          <span className="text-sm">💊</span>
          <span className="text-xs">{t('common.medicine')}</span>
        </NavLink>
      </div>
    </nav>
  )
}

export default MobileTabBar