import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const sample = [
  { id: 'P-001', name: 'Suresh Kumar', lastVisit: '2025-11-15', diagnosis: 'Hypertension' },
  { id: 'P-002', name: 'Anita Devi', lastVisit: '2025-10-02', diagnosis: 'Diabetes' },
  { id: 'P-003', name: 'Ramesh Singh', lastVisit: '2025-09-23', diagnosis: 'Asthma' },
]

export default function DoctorHealthRecordsPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = sample.filter(s =>
    !query || s.name.toLowerCase().includes(query.toLowerCase()) || s.id.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Health Records</h1>
        <div className="flex items-center gap-2">
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name or ID" className="max-w-sm px-3 py-1 border rounded-md" />
          <button onClick={() => navigate('/doctor/dashboard')} className="px-3 py-1 bg-slate-200 rounded-md hover:bg-slate-300">
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-lg p-3 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-zinc-600">
                <th className="py-2">Patient Name</th>
                <th className="py-2">ID / Record No.</th>
                <th className="py-2">Last Visit</th>
                <th className="py-2">Primary Diagnosis</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-t hover:bg-zinc-50 cursor-pointer" onClick={() => setSelected(p)}>
                  <td className="py-2">{p.name}</td>
                  <td className="py-2">{p.id}</td>
                  <td className="py-2">{p.lastVisit}</td>
                  <td className="py-2">{p.diagnosis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white border border-zinc-200 rounded-lg p-4 shadow-sm">
          {!selected ? (
            <div className="text-zinc-500">Select a patient to view records</div>
          ) : (
            <div>
              <h2 className="text-lg font-medium mb-2">{selected.name}</h2>
              <div className="text-sm text-zinc-600 mb-3">ID: {selected.id}</div>
              <div className="space-y-2">
                <div><strong>Demographics:</strong> Age: 45, Gender: Male</div>
                <div><strong>Recent visits:</strong>
                  <ul className="list-disc list-inside">
                    <li>2025-11-15 — Follow up for blood pressure</li>
                    <li>2025-07-10 — Initial diagnosis</li>
                  </ul>
                </div>
                <div><strong>Current medications:</strong>
                  <ul className="list-disc list-inside">
                    <li>Amlodipine 5mg — Once daily</li>
                    <li>Losartan 50mg — Once daily</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}