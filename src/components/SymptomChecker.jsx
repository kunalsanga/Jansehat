import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

function SymptomChecker() {
    const [symptom, setSymptom] = useState('')
    return (
      <div className="space-y-6 pb-20 sm:pb-6">
        <div className="flex items-center gap-3">
          <NavLink to="/" className="shrink-0 w-9 h-9 rounded-full border border-zinc-200 grid place-items-center hover:bg-zinc-50">←</NavLink>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Symptom Checker</h1>
            <p className="text-sm text-zinc-600">Get preliminary health insights based on your symptoms</p>
          </div>
        </div>
  
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl bg-white border border-zinc-200 shadow-sm">
            <div className="px-5 py-4 border-b border-zinc-200 flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 grid place-items-center">🩺</div>
              <div className="font-semibold">Describe Your Symptoms</div>
            </div>
            <div className="p-5">
              <textarea
                value={symptom}
                onChange={(e) => setSymptom(e.target.value)}
                rows={5}
                placeholder="Please describe your symptoms in detail. For example: 'I have a headache that started this morning, along with a runny nose and slight fever...'"
                className="w-full px-4 py-3 rounded-lg bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="mt-4 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition">
                <span>🔎</span>
                <span>Check Symptoms</span>
              </button>
            </div>
          </div>
  
          <div className="rounded-2xl bg-white border border-zinc-200 shadow-sm">
            <div className="p-5 text-center">
              <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-blue-100 text-blue-600 grid place-items-center text-xl">⚠️</div>
              <div className="font-semibold mb-1">Important Notice</div>
              <p className="text-sm text-zinc-600 leading-relaxed">
                This tool provides preliminary guidance only. It is not a substitute for professional medical diagnosis or treatment. Always consult with qualified healthcare professionals for accurate diagnosis and treatment.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  

export default SymptomChecker