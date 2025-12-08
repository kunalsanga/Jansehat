import React from 'react'
import { useNavigate } from 'react-router-dom'

function LoginRoleSelection() {
  const navigate = useNavigate()

  const roles = [
    { title: 'Patient', icon: '👤', path: '/login/patient' },
    { title: 'Asha Didi', icon: '👩‍⚕️', path: '/login/asha' },
    { title: 'Doctor', icon: '👨‍⚕️', path: '/login/doctor' },
    { title: 'Pharmacist', icon: '💊', path: '/login/pharmacist' },
  ]

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800 mb-2">
            JanSehat
          </h1>
          <p className="text-sm text-slate-600">
            Select your role to login
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          {roles.map((role) => (
            <button
              key={role.title}
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
            New user?{' '}
            <button 
              onClick={() => navigate('/signup')}
              className="text-slate-700 hover:text-slate-900 underline font-medium"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginRoleSelection
