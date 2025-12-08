import React from 'react'
import { useNavigate } from 'react-router-dom'

function StatCard({ title, value }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-4 shadow-sm">
      <div className="text-sm text-zinc-500">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const appointments = [
    { name: 'Suresh Kumar', time: '09:30', type: 'Online', status: 'Checked-in' },
    { name: 'Anita Devi', time: '10:15', type: 'Offline', status: 'Scheduled' },
    { name: 'Ramesh Singh', time: '11:00', type: 'Online', status: 'Completed' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Quick Stats</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Today's Patients" value="12" />
        <StatCard title="Upcoming Appointments" value="8" />
        <StatCard title="Active Emergencies" value="3" />
        <StatCard title="Pending Reports" value="5" />
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Today's Appointments</h2>
          <div className="space-x-2">
            <button onClick={() => navigate('/doctor/emergency-calls')} className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700">View Emergency List</button>
            <button onClick={() => navigate('/doctor/video')} className="px-3 py-1 bg-slate-700 text-white rounded-md text-sm hover:bg-slate-800">Start Video Consult</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-zinc-600 border-b">
                <th className="py-2 px-2">Patient Name</th>
                <th className="py-2 px-2">Time</th>
                <th className="py-2 px-2">Type</th>
                <th className="py-2 px-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a, i) => (
                <tr key={i} className="border-t hover:bg-zinc-50">
                  <td className="py-2 px-2">{a.name}</td>
                  <td className="py-2 px-2">{a.time}</td>
                  <td className="py-2 px-2">{a.type}</td>
                  <td className="py-2 px-2">{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}