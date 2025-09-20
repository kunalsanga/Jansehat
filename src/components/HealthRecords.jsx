import React, { useState } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'

function HealthRecords() {
    const [tab, setTab] = useState('profile')
    return (
      <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <NavLink to="/" className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-zinc-200 grid place-items-center hover:bg-zinc-50 text-sm sm:text-base">←</NavLink>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">Health Records</h1>
            <p className="text-xs sm:text-sm text-zinc-600">Manage your medical information securely</p>
          </div>
        </div>
  
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          <button onClick={() => setTab('profile')} className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl border whitespace-nowrap text-sm sm:text-base ${tab==='profile' ? 'bg-white border-zinc-300 shadow-sm' : 'border-zinc-200 hover:bg-zinc-50'}`}>
            <span className="mr-1 sm:mr-2">👤</span>Profile
          </button>
          <button onClick={() => setTab('history')} className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl border whitespace-nowrap text-sm sm:text-base ${tab==='history' ? 'bg-white border-zinc-300 shadow-sm' : 'border-zinc-200 hover:bg-zinc-50'}`}>
            <span className="mr-1 sm:mr-2">🩺</span>Medical History
          </button>
        </div>
  
        {/* Card */}
        <div className="rounded-xl sm:rounded-2xl bg-white border border-zinc-200 shadow-sm">
          <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-zinc-200 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-100 text-purple-600 grid place-items-center text-sm sm:text-base">🧑‍⚕️</div>
              <div className="font-semibold text-sm sm:text-base">Patient Profile</div>
            </div>
            <button className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-zinc-300 hover:bg-zinc-50 text-xs sm:text-sm">Edit Profile</button>
          </div>
  
          {tab === 'profile' && (
            <div className="p-4 sm:p-5 space-y-4 sm:space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1">Full Name</label>
                  <input type="text" placeholder="Enter your full name" className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1">Age</label>
                  <input type="number" placeholder="Enter your age" className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base" />
                </div>
              </div>
  
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1">Phone Number</label>
                  <input type="tel" placeholder="Enter your phone number" className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1">Gender</label>
                  <select className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base">
                    <option>Select gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
  
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1">Emergency Contact</label>
                <input type="tel" placeholder="Emergency contact number" className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base" />
              </div>
            </div>
          )}
  
          {tab === 'history' && (
            <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
              <div className="rounded-lg sm:rounded-xl border border-zinc-200 p-3 sm:p-4">
                <div className="font-medium mb-2 text-sm sm:text-base">Allergies</div>
                <input type="text" placeholder="e.g., Penicillin, Peanuts" className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base" />
              </div>
              <div className="rounded-lg sm:rounded-xl border border-zinc-200 p-3 sm:p-4">
                <div className="font-medium mb-2 text-sm sm:text-base">Current Medications</div>
                <textarea rows="3" placeholder="List any medications you are currently taking" className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base resize-none" />
              </div>
              <div className="rounded-lg sm:rounded-xl border border-zinc-200 p-3 sm:p-4">
                <div className="font-medium mb-2 text-sm sm:text-base">Past Surgeries / Conditions</div>
                <textarea rows="3" placeholder="Provide relevant medical history" className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base resize-none" />
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
  

export default HealthRecords