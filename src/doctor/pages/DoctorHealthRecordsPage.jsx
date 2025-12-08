import React, { useState } from 'react'

const sample = [
  { id: 'P-001', name: 'Suresh Kumar', lastVisit: '2025-12-08', diagnosis: 'Hypertension', age: 45, gender: 'Male', contact: '9876543210' },
  { id: 'P-002', name: 'Anita Devi', lastVisit: '2025-12-07', diagnosis: 'Diabetes', age: 38, gender: 'Female', contact: '9876543211' },
  { id: 'P-003', name: 'Ramesh Singh', lastVisit: '2025-12-05', diagnosis: 'Asthma', age: 52, gender: 'Male', contact: '9876543212' },
]

export default function DoctorHealthRecordsPage() {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = sample.filter(
    s =>
      !query ||
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.id.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Health Records</h1>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by name or ID"
          className="max-w-sm px-3 py-2 border border-zinc-300 rounded-md text-sm"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-lg p-4 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-zinc-600 border-b">
                <th className="py-3 px-2">Patient Name</th>
                <th className="py-3 px-2">ID / Record No.</th>
                <th className="py-3 px-2">Last Visit</th>
                <th className="py-3 px-2">Primary Diagnosis</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr
                  key={p.id}
                  className="border-t hover:bg-zinc-50 cursor-pointer"
                  onClick={() => setSelected(p)}
                >
                  <td className="py-3 px-2">{p.name}</td>
                  <td className="py-3 px-2">{p.id}</td>
                  <td className="py-3 px-2">{p.lastVisit}</td>
                  <td className="py-3 px-2">{p.diagnosis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white border border-zinc-200 rounded-lg p-4 shadow-sm">
          {!selected ? (
            <div className="text-center text-zinc-500">
              <div className="text-4xl mb-2">📋</div>
              <p className="text-sm">Select a patient to view records</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900">{selected.name}</h2>
                <p className="text-xs text-zinc-600">ID: {selected.id}</p>
              </div>

              <div className="border-t pt-3">
                <h3 className="font-medium text-sm text-zinc-700 mb-2">Demographics</h3>
                <div className="text-xs text-zinc-600 space-y-1">
                  <p>Age: {selected.age}</p>
                  <p>Gender: {selected.gender}</p>
                  <p>Contact: {selected.contact}</p>
                </div>
              </div>

              <div className="border-t pt-3">
                <h3 className="font-medium text-sm text-zinc-700 mb-2">Recent Visits</h3>
                <ul className="text-xs text-zinc-600 space-y-1">
                  <li>• {selected.lastVisit} — {selected.diagnosis}</li>
                  <li>• 2025-10-15 — Follow-up consultation</li>
                  <li>• 2025-08-20 — Initial assessment</li>
                </ul>
              </div>

              <div className="border-t pt-3">
                <h3 className="font-medium text-sm text-zinc-700 mb-2">Current Medications</h3>
                <ul className="text-xs text-zinc-600 space-y-1">
                  <li>• Amlodipine 5mg — Once daily</li>
                  <li>• Metformin 500mg — Twice daily</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}