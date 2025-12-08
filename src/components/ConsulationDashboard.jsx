import React from 'react'
export default function ConsultationDashboard() {
  const totalConsultations = 0
  return (
    <div className="min-h-screen bg-rose-50 flex flex-col items-stretch">
      {/* Top app bar */}
      <header className="w-full bg-white shadow-sm">
        <div className="max-w-xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500"> 
              {/* placeholder avatar */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A6 6 0 0112 15a6 6 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h1 className="text-lg font-semibold"></h1>
          </div>
          <div className="text-sm text-gray-400"> 
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 012 0v1h-2V2z" />
            </svg>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-xl mx-auto px-4 py-6 space-y-6 w-full flex-1">
        {/* Card 1 - Consult Now */}
        <section className="bg-white rounded-lg border-2 border-emerald-400 p-6 shadow-sm">
          <div className="flex flex-col items-center gap-6">
            {/* doctor + phone illustration (simple svg) */}
            <div className="w-36 h-36 flex items-center justify-center">
              
              <img 
                    src="/vc_village.jpg"   // if doctor.png is inside public/
                    alt="Doctor"
                    className="w-full h-full object-contain"
                />
            </div>

            <button className="mt-2 bg-indigo-900 text-white text-base font-medium px-8 py-3 rounded-full shadow-md">Consult Now</button>
          </div>
        </section>

        {/* Card 2 - Stats */}
        <section className="bg-white rounded-lg border-2 border-emerald-400 p-5 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-50 rounded-md flex items-center justify-center shadow-sm">
                {/* small monitor icon */}
                <img src="video.png" alt="" />
              </div>
              <div>
                <p className="text-gray-700 font-medium">Total Consultations</p>
              </div>
            </div>
            <div className="text-2xl font-semibold">{totalConsultations}</div>
          </div>

          {/* Green wave chart at bottom using svg */}
          <div className="mt-4 -mx-5">
            <svg viewBox="0 0 600 120" className="w-full h-24" preserveAspectRatio="none">
              <defs>
                <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#bbf7d0" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#bbf7d0" stopOpacity="0.6" />
                </linearGradient>
              </defs>
              <path d="M0 70 C60 40 120 80 180 60 C240 40 300 80 360 55 C420 30 480 90 540 60 C560 50 600 60 600 60 L600 120 L0 120 Z" fill="url(#g1)" stroke="#10b981" strokeWidth="2" opacity="0.95"/>
            </svg>
          </div>
        </section>

      </main>

      
    </div>
  )
}