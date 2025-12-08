import React from 'react'
import { useNavigate } from 'react-router-dom'

function ActionCard({ title, description, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white border border-zinc-200 rounded-lg p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all text-left"
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-zinc-900 mb-2">{title}</h3>
      <p className="text-sm text-zinc-600">{description}</p>
    </button>
  )
}

export default function DoctorDashboard() {
  const navigate = useNavigate()

  const actions = [
    {
      title: 'Emergency Patients',
      description: 'View and manage emergency patient calls',
      icon: '🚨',
      path: '/doctor/emergency-calls',
    },
    {
      title: "Today's Appointments",
      description: "View today's scheduled appointments",
      icon: '📅',
      path: '/doctor/todays-appointments',
    },
    {
      title: 'Video Recordings',
      description: 'Access and manage video consultations',
      icon: '📹',
      path: '/doctor/video',
    },
    {
      title: 'Health Records',
      description: 'Search and review patient health records',
      icon: '📋',
      path: '/doctor/health-records',
    },
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">Dashboard</h1>
        <p className="text-zinc-600 mt-2">Welcome back. Select an action to get started.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {actions.map(action => (
          <ActionCard
            key={action.path}
            title={action.title}
            description={action.description}
            icon={action.icon}
            onClick={() => navigate(action.path)}
          />
        ))}
      </div>
    </div>
  )
}