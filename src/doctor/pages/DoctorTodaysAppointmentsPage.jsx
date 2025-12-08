import React, { useState } from 'react'

const sample = [
  { id: 1, name: 'Suresh Kumar', time: '09:30', mode: 'Video', status: 'Completed' },
  { id: 2, name: 'Anita Devi', time: '10:15', mode: 'In-person', status: 'Checked-in' },
  { id: 3, name: 'Ramesh Singh', time: '11:00', mode: 'Video', status: 'Scheduled' },
  { id: 4, name: 'Priya Sharma', time: '14:30', mode: 'In-person', status: 'Scheduled' },
]

function SummaryCard({ title, value }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-4 shadow-sm">
      <div className="text-sm text-zinc-600">{title}</div>
      <div className="mt-2 text-2xl font-semibold text-zinc-900">{value}</div>
    </div>
  )
}

export default function DoctorTodaysAppointmentsPage() {
  const [selectedStatus, setSelectedStatus] = useState('All')

  const filtered =
    selectedStatus === 'All'
      ? sample
      : sample.filter(s => s.status === selectedStatus)

  const stats = {
    total: sample.length,
    completed: sample.filter(s => s.status === 'Completed').length,
    pending: sample.filter(s => s.status === 'Scheduled').length,
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold">Today's Appointments</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard title="Total Appointments" value={stats.total} />
        <SummaryCard title="Completed" value={stats.completed} />
        <SummaryCard title="Pending" value={stats.pending} />
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Appointments List</h2>
        <select
          value={selectedStatus}
          onChange={e => setSelectedStatus(e.target.value)}
          className="px-3 py-2 border border-zinc-300 rounded-md text-sm"
        >
          <option>All</option>
          <option>Scheduled</option>
          <option>Completed</option>
          <option>Checked-in</option>
        </select>
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg p-4 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-zinc-600 border-b">
              <th className="py-3 px-2">Patient Name</th>
              <th className="py-3 px-2">Time</th>
              <th className="py-3 px-2">Mode</th>
              <th className="py-3 px-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(appt => (
              <tr key={appt.id} className="border-t hover:bg-zinc-50">
                <td className="py-3 px-2">{appt.name}</td>
                <td className="py-3 px-2">{appt.time}</td>
                <td className="py-3 px-2">{appt.mode}</td>
                <td className="py-3 px-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      appt.status === 'Completed'
                        ? 'bg-green-100 text-green-700'
                        : appt.status === 'Checked-in'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {appt.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
