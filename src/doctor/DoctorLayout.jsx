import React, { useMemo } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import DoctorHeader from './DoctorHeader'
import DoctorSidebar from './DoctorSidebar'
import DoctorDashboard from './pages/DoctorDashboard'
import EmergencyPatientsPage from './pages/DoctorEmergencyCallsPage'
import AppointmentsPage from './pages/DoctorTodaysAppointmentsPage'
import VideoRecordingsPage from './pages/DoctorVideoPage'
import HealthRecordsPage from './pages/DoctorHealthRecordsPage'

export default function DoctorLayout() {
  const location = useLocation()

  // Check if current route is dashboard (no sidebar) or a section page (with sidebar)
  const isDashboard = useMemo(() => {
    return location.pathname === '/doctor/dashboard' || location.pathname === '/doctor'
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <DoctorHeader />
      <div className="flex">
        {!isDashboard && <DoctorSidebar />}
        <main className={`flex-1 ${isDashboard ? 'w-full' : ''} px-4 sm:px-6 lg:px-8 py-6`}>
          <Routes>
            <Route path="/" element={<Navigate to="/doctor/dashboard" replace />} />
            <Route path="dashboard" element={<DoctorDashboard />} />
            <Route path="emergency-calls" element={<EmergencyPatientsPage />} />
            <Route path="todays-appointments" element={<AppointmentsPage />} />
            <Route path="video" element={<VideoRecordingsPage />} />
            <Route path="health-records" element={<HealthRecordsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}