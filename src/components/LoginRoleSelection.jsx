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
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 sm:p-6 font-sans text-zinc-900">

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
            Choose your account type to continue
          </p>
        </div>

        {/* Role Grid - Clean, Outline Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
          {roles.map((role) => (
            <button
              key={role.title}
              onClick={() => navigate(role.path)}
              className="group flex items-center p-4 rounded-xl border border-zinc-200 bg-white hover:border-zinc-400 hover:bg-zinc-50 transition-all duration-200 ease-out text-left"
            >
              <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-2xl mr-4 group-hover:bg-white group-hover:shadow-sm transition-all">
                {role.icon}
              </div>
              <div>
                <h3 className="text-base font-semibold text-zinc-900 group-hover:text-black">
                  {role.title}
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
            New to JanSehat?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-black font-semibold hover:underline underline-offset-4"
            >
              Create an account
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginRoleSelection
