import React, { useState } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'

function HealthRecords() {
    const [tab, setTab] = useState('profile')
    return (
      <div className="space-y-6 pb-20 sm:pb-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <NavLink to="/" className="shrink-0 w-9 h-9 rounded-full border border-zinc-200 grid place-items-center hover:bg-zinc-50">←</NavLink>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Health Records</h1>
            <p className="text-sm text-zinc-600">Manage your medical information securely</p>
          </div>
        </div>
  
        {/* Tabs */}
        <div className="flex gap-2">
          <button onClick={() => setTab('profile')} className={`px-4 py-2 rounded-xl border ${tab==='profile' ? 'bg-white border-zinc-300 shadow-sm' : 'border-zinc-200 hover:bg-zinc-50'}`}>
            <span className="mr-2">👤</span>Profile
          </button>
          <button onClick={() => setTab('history')} className={`px-4 py-2 rounded-xl border ${tab==='history' ? 'bg-white border-zinc-300 shadow-sm' : 'border-zinc-200 hover:bg-zinc-50'}`}>
            <span className="mr-2">🩺</span>Medical History
          </button>
        </div>
  
        {/* Card */}
        <div className="rounded-2xl bg-white border border-zinc-200 shadow-sm">
          <div className="px-5 py-4 border-b border-zinc-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 grid place-items-center">🧑‍⚕️</div>
              <div className="font-semibold">Patient Profile</div>
            </div>
            <button className="px-3 py-2 rounded-lg border border-zinc-300 hover:bg-zinc-50 text-sm">Edit Profile</button>
          </div>
  
          {tab === 'profile' && (
            <div className="p-5 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input type="text" placeholder="Enter your full name" className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Age</label>
                  <input type="number" placeholder="Enter your age" className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
  
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <input type="tel" placeholder="Enter your phone number" className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Gender</label>
                  <select className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Select gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
  
              <div>
                <label className="block text-sm font-medium mb-1">Emergency Contact</label>
                <input type="tel" placeholder="Emergency contact number" className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          )}
  
          {tab === 'history' && (
            <div className="p-5 space-y-4">
              <div className="rounded-xl border border-zinc-200 p-4">
                <div className="font-medium mb-2">Allergies</div>
                <input type="text" placeholder="e.g., Penicillin, Peanuts" className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="rounded-xl border border-zinc-200 p-4">
                <div className="font-medium mb-2">Current Medications</div>
                <textarea rows="3" placeholder="List any medications you are currently taking" className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="rounded-xl border border-zinc-200 p-4">
                <div className="font-medium mb-2">Past Surgeries / Conditions</div>
                <textarea rows="3" placeholder="Provide relevant medical history" className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
  

export default HealthRecords