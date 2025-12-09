import { NavLink } from 'react-router-dom'

export default function DoctorSidebar() {
  const items = [
    { to: '/doctor/dashboard', label: 'Dashboard' },
    { to: '/doctor/video-call', label: '🔴 Live Video Call' },
    { to: '/doctor/emergency-calls', label: 'Emergency Patients' },
    { to: '/doctor/todays-appointments', label: "Today's Appointments" },
    { to: '/doctor/video', label: 'Video Recordings' },
    { to: '/doctor/health-records', label: 'Health Records' },
  ]

  return (
    <aside className="w-64 bg-white border-r border-zinc-200 min-h-screen hidden lg:block">
      <nav className="p-3 space-y-1">
        {items.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-zinc-700 hover:bg-zinc-100'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}