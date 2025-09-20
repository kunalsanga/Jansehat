import React from 'react'
import { NavLink } from 'react-router-dom'
function ServiceCard({ imgSrc, icon, title, description, to }) {
    return (
      <NavLink
        to={to}
        className="group block rounded-xl sm:rounded-2xl relative overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 min-h-[140px] sm:min-h-[160px]"
      >
        {/* Background image */}
        <img
          src={imgSrc}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
  
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
  
        {/* Content */}
        <div className="relative p-4 sm:p-5 flex items-start gap-3 sm:gap-4 text-white h-full">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl grid place-items-center text-lg sm:text-2xl bg-white/30 flex-shrink-0">{icon}</div>
          <div className="flex-1 min-w-0">
            <div className="text-lg sm:text-xl font-semibold mb-1 leading-tight">{title}</div>
            <div className="text-xs sm:text-sm leading-snug opacity-90">{description}</div>
          </div>
          <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-white/70 group-hover:text-white group-hover:translate-x-0.5 transition-all text-lg sm:text-xl">
            ›
          </div>
        </div>
      </NavLink>
    )
  }
  
export default ServiceCard