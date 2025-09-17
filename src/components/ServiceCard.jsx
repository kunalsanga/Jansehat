import React from 'react'
import { NavLink } from 'react-router-dom'
function ServiceCard({ imgSrc, icon, title, description, to }) {
    return (
      <NavLink
        to={to}
        className="group block rounded-2xl relative overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
      >
        {/* Background image */}
        <img
          src={imgSrc}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
  
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-black/30"></div>
  
        {/* Content */}
        <div className="relative p-5 flex items-start gap-4 text-white">
          <div className="w-12 h-12 rounded-xl grid place-items-center text-2xl bg-white/30">{icon}</div>
          <div className="flex-1">
            <div className="text-xl font-semibold mb-1">{title}</div>
            <div className="text-sm leading-snug">{description}</div>
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 group-hover:text-white group-hover:translate-x-0.5 transition">
            ›
          </div>
        </div>
      </NavLink>
    )
  }
  
export default ServiceCard