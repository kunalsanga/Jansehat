import React, { useState } from 'react'

const sample = [
  { id: 1, name: 'Radha Patel', age: 34, complaint: 'Chest pain', priority: 'High', time: '09:05' },
  { id: 2, name: 'Mohit Sharma', age: 45, complaint: 'Breathing difficulty', priority: 'High', time: '09:20' },
  { id: 3, name: 'Sunita Rao', age: 29, complaint: 'Fever & vomiting', priority: 'Medium', time: '09:40' },
]

function PriorityBadge({ p }) {
  const cls =
    p === 'High'
      ? 'bg-red-100 text-red-700'
      : p === 'Medium'
      ? 'bg-yellow-100 text-yellow-700'
      : 'bg-green-100 text-green-700'

  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${cls}`}>{p}</span>
}

export default function DoctorEmergencyCallsPage() {
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(null)

  const list = sample.filter(s => (filter === 'All' ? true : s.priority === filter))

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Emergency Patients</h1>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="px-3 py-2 border border-zinc-300 rounded-md text-sm"
        >
          <option>All</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-zinc-200 rounded-lg p-4 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-zinc-600 border-b">
              <th className="py-3 px-2">Name</th>
              <th className="py-3 px-2">Age</th>
              <th className="py-3 px-2">Condition</th>
              <th className="py-3 px-2">Priority</th>
              <th className="py-3 px-2">Time</th>
            </tr>
          </thead>

          <tbody>
            {list.map(p => (
              <tr
                key={p.id}
                className="border-t hover:bg-zinc-50 cursor-pointer"
                onClick={() => setSelected(p)}
              >
                <td className="py-3 px-2">{p.name}</td>
                <td className="py-3 px-2">{p.age}</td>
                <td className="py-3 px-2">{p.complaint}</td>
                <td className="py-3 px-2">
                  <PriorityBadge p={p.priority} />
                </td>
                <td className="py-3 px-2">{p.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Selected Patient Details */}
      {selected && (
        <div className="bg-white border border-zinc-200 rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-medium mb-3">Patient Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <strong className="text-zinc-700">Name:</strong>
              <p className="text-zinc-900">{selected.name}</p>
            </div>

            <div>
              <strong className="text-zinc-700">Age:</strong>
              <p className="text-zinc-900">{selected.age}</p>
            </div>

            <div>
              <strong className="text-zinc-700">Complaint:</strong>
              <p className="text-zinc-900">{selected.complaint}</p>
            </div>

            <div>
              <strong className="text-zinc-700">Priority:</strong>
              <p>
                <PriorityBadge p={selected.priority} />
              </p>
            </div>

            <div>
              <strong className="text-zinc-700">Time Reported:</strong>
              <p className="text-zinc-900">{selected.time}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
              Assign to Me
            </button>

            <button
              className="px-4 py-2 bg-slate-200 text-slate-900 rounded-md text-sm hover:bg-slate-300"
              onClick={() => setSelected(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
