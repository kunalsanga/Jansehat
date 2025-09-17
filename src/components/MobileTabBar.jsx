import React from 'react'
import { NavLink } from 'react-router-dom'

function MobileTabBar() {
    return (
      <nav className="fixed bottom-0 inset-x-0 z-20 bg-white border-t border-zinc-200 sm:hidden">
        <div className="grid grid-cols-5 text-xs">
          <NavLink to="/" end className={({ isActive }) => `px-2 py-3 text-center ${isActive ? 'text-blue-600' : 'text-zinc-500'}`}>Home</NavLink>
          <NavLink to="/symptoms" className={({ isActive }) => `px-2 py-3 text-center ${isActive ? 'text-blue-600' : 'text-zinc-500'}`}>Symptoms</NavLink>
          <NavLink to="/video" className={({ isActive }) => `px-2 py-3 text-center ${isActive ? 'text-blue-600' : 'text-zinc-500'}`}>Video</NavLink>
          <NavLink to="/records" className={({ isActive }) => `px-2 py-3 text-center ${isActive ? 'text-blue-600' : 'text-zinc-500'}`}>Records</NavLink>
          <NavLink to="/medicine" className={({ isActive }) => `px-2 py-3 text-center ${isActive ? 'text-blue-600' : 'text-zinc-500'}`}>Medicine</NavLink>
        </div>
      </nav>
    )
  }

export default MobileTabBar