import { useNavigate } from 'react-router-dom'

export default function DoctorHeader() {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-20 bg-gradient-to-b from-white/90 to-white/70 backdrop-blur border-b border-zinc-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <img
            src="/logo.jpg"
            alt="App Logo"
            className="w-6 h-6 sm:w-7 sm:h-7 rounded"
            loading="eager"
            decoding="async"
            width="28"
            height="28"
          />
          <div className="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            JanSehat
          </div>
        </button>
        <div className="text-sm text-zinc-600">Doctor Portal</div>
      </div>
    </header>
  )
}