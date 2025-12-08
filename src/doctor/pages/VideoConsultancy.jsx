import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function DoctorVideoPage() {
  const navigate = useNavigate()
  const [notes, setNotes] = useState('')

  const previous = [
    { date: '2025-11-01', summary: 'Follow up - blood pressure controlled' },
    { date: '2025-08-12', summary: 'Initial consult - chest pain' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Video Recordings / Video Consultancy</h1>
        <button onClick={() => navigate('/doctor/dashboard')} className="px-3 py-1 bg-slate-200 rounded-md hover:bg-slate-300">
          Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="bg-white border border-zinc-200 rounded-lg p-4 shadow-sm h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-3">📹</div>
              <div className="text-zinc-400">Video area (placeholder)</div>
            </div>
          </div>
        </div>

        <aside className="bg-white border border-zinc-200 rounded-lg p-4 shadow-sm">
          <div className="mb-4 pb-4 border-b">
            <h2 className="text-lg font-medium">Patient Info</h2>
            <div className="text-sm text-zinc-600 mt-2">Name: Suresh Kumar</div>
            <div className="text-sm text-zinc-600">Age: 45</div>
            <div className="text-sm text-zinc-600">ID: P-001</div>
          </div>

          <div className="mb-4 pb-4 border-b">
            <h3 className="font-medium mb-2">Notes</h3>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full p-2 border rounded-md h-28 text-sm" />
            <div className="mt-2 space-x-2">
              <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">Start Call</button>
              <button className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700">End Call</button>
              <button className="px-3 py-1 bg-slate-600 text-white rounded-md text-sm hover:bg-slate-700">Save Notes</button>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Previous Consultations</h3>
            <ul className="text-sm space-y-2">
              {previous.map((p, i) => (
                <li key={i} className="pb-2 border-b">
                  <div className="font-medium">{p.date}</div>
                  <div className="text-zinc-600 text-xs">{p.summary}</div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}