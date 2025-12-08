import React from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom';

function SideNav() {
  const { t } = useTranslation()
  const Item = ({ to, label, icon }) => (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md transition ${isActive ? 'bg-blue-50 text-blue-700' : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900'}`}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </NavLink>
  )

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 xl:w-72 shrink-0 border-r border-zinc-200 bg-white rounded-r-xl">
      <div className="px-4 py-4 xl:py-5 flex items-center gap-3">
        <div className="w-9 h-9 xl:w-10 xl:h-10 rounded-xl xl:rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 grid place-items-center text-white text-base xl:text-lg">🩺</div>
        <div>
          <div className="font-semibold text-sm xl:text-base">{t('appName')}</div>
          <div className="text-xs text-zinc-500">{t('tagline')}</div>
        </div>
      </div>
      <nav className="flex flex-col px-2 pb-4 gap-1">
        <Item to="/home" label={t('common.home')} icon="🏠" />
        <Item to="/symptoms" label={t('common.symptoms')} icon="🩻" />
        <Item to="/video" label={t('common.video')} icon="🎥" />
        <Item to="/records" label={t('common.records')} icon="📄" />
        <Item to="/medicine" label={t('common.medicine')} icon="💊" />
        <Item to="/emergency" label={t('common.emergency')} icon="🚨" />
        <Item to="/navigation" label={t('common.navigation')} icon="🗺️" />
      </nav>
    </aside>
  )
}

export default SideNav;