import React from 'react'

const recordings = [
  { id: 1, patientName: 'Suresh Kumar', date: '2025-12-08', duration: '15 min', status: 'Available' },
  { id: 2, patientName: 'Anita Devi', date: '2025-12-07', duration: '22 min', status: 'Available' },
  { id: 3, patientName: 'Ramesh Singh', date: '2025-12-05', duration: '18 min', status: 'Available' },
  { id: 4, patientName: 'Priya Sharma', date: '2025-12-03', duration: 'N/A', status: 'Not recorded' },
]

export default function DoctorVideoPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold">Video Recordings</h1>

      <div className="bg-white border border-zinc-200 rounded-lg p-4 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-zinc-600 border-b">
              <th className="py-3 px-2">Patient Name</th>
              <th className="py-3 px-2">Date</th>
              <th className="py-3 px-2">Duration</th>
              <th className="py-3 px-2">Status</th>
              <th className="py-3 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recordings.map(rec => (
              <tr key={rec.id} className="border-t hover:bg-zinc-50">
                <td className="py-3 px-2">{rec.patientName}</td>
                <td className="py-3 px-2">{rec.date}</td>
                <td className="py-3 px-2">{rec.duration}</td>
                <td className="py-3 px-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rec.status === 'Available'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {rec.status}
                  </span>
                </td>
                <td className="py-3 px-2 space-x-1">
                  {rec.status === 'Available' && (
                    <>
                      <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700">
                        View
                      </button>
                      <button className="px-3 py-1 bg-slate-600 text-white rounded-md text-xs hover:bg-slate-700">
                        Download
                      </button>
                    </>
                  )}
                  {rec.status === 'Not recorded' && (
                    <span className="text-xs text-gray-500">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}