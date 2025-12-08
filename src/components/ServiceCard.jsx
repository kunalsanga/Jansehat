import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

const colorMap = {
  blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
  indigo: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white',
  emerald: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white',
  teal: 'bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white',
  red: 'bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white',
  cyan: 'bg-cyan-50 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white',
  purple: 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white',
}

function ServiceCard({ imgSrc, icon, title, description, to, color = 'blue' }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const iconColorClass = colorMap[color] || colorMap.blue

  return (
    <NavLink
      to={to}
      className="group relative flex flex-col h-full bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative h-40 sm:h-48 overflow-hidden">
        {/* Background image */}
        <img
          src={imgSrc}
          alt={title}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />

        {/* Loading placeholder */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-slate-100 animate-pulse flex items-center justify-center">
            <span className="text-4xl opacity-20">{icon}</span>
          </div>
        )}

        {/* Error fallback */}
        {imageError && (
          <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
            <span className="text-4xl opacity-50">{icon}</span>
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-colors duration-300 ${iconColorClass}`}>
            {icon}
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors mb-2">
          {title}
        </h3>

        <p className="text-sm text-slate-500 leading-relaxed">
          {description}
        </p>
      </div>
    </NavLink>
  )
}

export default ServiceCard