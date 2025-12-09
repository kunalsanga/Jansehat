import React, { useState, useMemo, useEffect } from 'react'
import './AshaCalendar.css'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
]

function getMonthMatrix(year, month) {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const startDay = first.getDay() // 0=Sun..6
  const daysInMonth = last.getDate()

  const matrix = []
  let week = []
  // fill blanks (make week start Monday for rural familiarity? we'll keep Sunday start)
  for (let i = 0; i < startDay; i++) {
    week.push(null)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    week.push(new Date(year, month, d))
    if (week.length === 7) {
      matrix.push(week)
      week = []
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null)
    matrix.push(week)
  }
  return matrix
}

export default function AshaCalendar() {
  const today = new Date()
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState(null)
  const [emergencies, setEmergencies] = useState([])

  // Helper to open maps for tracking
  const openMapsFor = (lat, lng) => {
    if (!lat || !lng) {
      alert('Location not available for this user')
      return
    }
    const url = `https://www.google.com/maps/@${lat},${lng},17z`
    window.open(url, '_blank')
  }

  // Example events — in real app these would come from API
  // Each event has a `type` used for color-coding: 'vaccination'|'polio'|'camp'|'visit'
  const events = useMemo(() => {
    // keys: YYYY-MM-DD
    const e = {}
    const add = (y, m, d, title, desc, type) => {
      const key = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      if (!e[key]) e[key] = []
      e[key].push({ title, desc, type })
    }
    add(currentYear, currentMonth + 1, 5, 'Vaccination Drive', 'Polio and routine immunizations at the community centre, 10AM–2PM', 'vaccination')
    add(currentYear, currentMonth + 1, 12, 'Polio Medication', 'Polio drop at household door-to-door', 'polio')
    add(currentYear, currentMonth + 1, 19, 'Health Camp', 'General health check-up and medicines distribution', 'camp')
    // also add one event for today for easier testing
    const tKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    if (!e[tKey]) e[tKey] = []
    e[tKey].push({ title: 'Daily Visit', desc: 'Check on pregnant mothers and newborns', type: 'visit' })
    return e
  }, [currentMonth, currentYear])

  const matrix = useMemo(() => getMonthMatrix(currentYear, currentMonth), [currentYear, currentMonth])

  // Listen for emergency signals via localStorage (cross-tab) and a custom event (same-tab)
  useEffect(() => {
    function handleStorage(e) {
      if (!e) return
      try {
        // read latest emergency feed
        if (e.key === 'latestEmergency' || e.key === 'emergency_feed') {
          const raw = localStorage.getItem('emergency_feed')
          const feed = raw ? JSON.parse(raw) : []
          setEmergencies(feed)
        }
      } catch (err) {
        console.error('Error parsing emergency feed', err)
      }
    }

    function handleCustom(ev) {
      try {
        const payload = ev?.detail
        if (!payload) return
        setEmergencies(prev => [payload, ...prev].slice(0, 50))
      } catch (err) { console.error(err) }
    }

    // initialize from localStorage + Dummy Data
    try {
      const raw = localStorage.getItem('emergency_feed')
      const feed = raw ? JSON.parse(raw) : []
      if (feed.length === 0) {
        // Add dummy data for presentation
        const dummy = [
          { id: 'EMG-9021', ts: Date.now() - 100000, lat: 28.5, lng: 77.2, condition: 'Labor Pain' },
          { id: 'EMG-9022', ts: Date.now() - 500000, lat: 28.6, lng: 77.3, condition: 'High Fever' },
          { id: 'EMG-9023', ts: Date.now() - 1200000, lat: 28.7, lng: 77.1, condition: 'Accident' },
          { id: 'EMG-9024', ts: Date.now() - 3600000, lat: 28.5, lng: 77.2, condition: 'Snake Bite' }
        ];
        setEmergencies(dummy);
      } else {
        setEmergencies(feed);
      }
    } catch (err) { console.error(err) }

    window.addEventListener('storage', handleStorage)
    window.addEventListener('app:emergency', handleCustom)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('app:emergency', handleCustom)
    }
  }, [])

  function prevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(y => y - 1)
    } else setCurrentMonth(m => m - 1)
  }
  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(y => y + 1)
    } else setCurrentMonth(m => m + 1)
  }

  function formatKey(date) {
    if (!date) return null
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">ASHA Worker Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Incoming Emergency Calls */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-red-500">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-red-600 flex items-center gap-2">
                <span className="animate-pulse">🚨</span> Incoming Calls
              </h2>
              <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-bold">{emergencies.length} Active</span>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
              {emergencies.length === 0 ? (
                <div className="text-center py-8 text-zinc-500 italic">No active emergency calls</div>
              ) : (
                emergencies.map((em, idx) => (
                  <div key={em.ts || idx} className="p-3 rounded-lg border border-red-100 bg-red-50 hover:bg-red-100 transition shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-slate-800 text-sm">Patient ID: {em.id.slice(-6).toUpperCase()}</span>
                      <span className="text-xxs text-slate-500">{new Date(em.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="text-xs text-slate-600 mb-3">
                      <p><strong>Condition:</strong> Critical / Pregnancy</p>
                      <p><strong>Location:</strong> Village Sector 4</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs py-2 rounded font-semibold shadow-sm transition">
                        📞 Call
                      </button>
                      <button
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs py-2 rounded font-semibold shadow-sm transition"
                        onClick={() => openMapsFor(em.lat || 28.6139, em.lng || 77.2090)}
                      >
                        📍 Track
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <h3 className="font-bold text-blue-800 mb-2">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <button className="bg-white p-2 rounded border border-blue-200 text-xs font-medium text-blue-700 hover:bg-blue-100">Register Pregnancy</button>
              <button className="bg-white p-2 rounded border border-blue-200 text-xs font-medium text-blue-700 hover:bg-blue-100">Update Vitals</button>
              <button className="bg-white p-2 rounded border border-blue-200 text-xs font-medium text-blue-700 hover:bg-blue-100">Schedule Visit</button>
              <button className="bg-white p-2 rounded border border-blue-200 text-xs font-medium text-blue-700 hover:bg-blue-100">Req. Medicine</button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-4 asha-card h-full">
            <div className="flex items-center justify-between mb-4 border-b pb-4">
              <button className="btn-nav p-2 hover:bg-slate-100 rounded-full" onClick={prevMonth} aria-label="Previous month">◀</button>
              <div className="text-center">
                <div className="text-xl font-bold text-slate-800">{MONTHS[currentMonth]}</div>
                <div className="text-sm text-zinc-500">{currentYear}</div>
              </div>
              <button className="btn-nav p-2 hover:bg-slate-100 rounded-full" onClick={nextMonth} aria-label="Next month">▶</button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold mb-2 text-slate-400 uppercase tracking-wider">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="py-2">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {matrix.map((week, wi) => (
                week.map((date, di) => {
                  const key = date ? formatKey(date) : `${wi}-${di}`
                  const dayEvents = date && events[formatKey(date)]
                  const isToday = date && formatKey(date) === formatKey(today)
                  const eventType = dayEvents ? dayEvents[0].type : null
                  const colorClass = eventType ? `date-${eventType}` : ''
                  return (
                    <button
                      key={key}
                      onClick={() => date && setSelectedDate(date)}
                      className={`
                        relative w-full aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-200
                        ${date ? 'bg-slate-50 hover:bg-white hover:shadow-md hover:scale-105 border border-transparent hover:border-slate-200' : 'invisible'} 
                        ${isToday ? 'ring-2 ring-blue-500 bg-blue-50' : ''} 
                        ${colorClass}
                      `}
                      disabled={!date}
                    >
                      <span className={`text-sm font-semibold ${isToday ? 'text-blue-600' : 'text-slate-700'}`}>{date ? date.getDate() : ''}</span>
                      {dayEvents && (
                        <div className="flex gap-1 mt-1">
                          {dayEvents.map((_, i) => (
                            <span key={i} className={`w-1.5 h-1.5 rounded-full ${eventType === 'vaccination' ? 'bg-purple-500' : eventType === 'polio' ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                          ))}
                        </div>
                      )}
                    </button>
                  )
                })
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-4 text-xs text-zinc-600 justify-center border-t pt-4">
              <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-purple-500"></span> Vaccination</div>
              <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-500"></span> Polio Drive</div>
              <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500"></span> Camp/Visit</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal / Popup */}
      {selectedDate && (
        <div className="asha-modal" role="dialog" aria-modal="true">
          <div className="asha-modal-content">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold">Events on {selectedDate.toLocaleDateString()}</h3>
              <button className="text-zinc-600" onClick={() => setSelectedDate(null)}>✕</button>
            </div>
            <div>
              {events[formatKey(selectedDate)] ? (
                events[formatKey(selectedDate)].map((ev, i) => (
                  <div key={i} className="bg-blue-50 p-3 rounded-lg mb-2">
                    <div className="font-semibold">{ev.title}</div>
                    <div className="text-sm text-zinc-700">{ev.desc}</div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-zinc-700">No events scheduled for this date.</div>
              )}
            </div>
            <div className="mt-3 text-right">
              <button
                className="btn-primary"
                onClick={() => {
                  // send an event notification to patients via localStorage + custom event
                  try {
                    const dateKey = formatKey(selectedDate)
                    const eventsForDate = events[dateKey] || []
                    const payload = {
                      id: `evt-${Date.now()}`,
                      ts: Date.now(),
                      date: selectedDate.toISOString(),
                      events: eventsForDate,
                      from: 'asha',
                      note: `Notification for events on ${selectedDate.toLocaleDateString()}`
                    }
                    const raw = localStorage.getItem('event_notifications')
                    const feed = raw ? JSON.parse(raw) : []
                    feed.unshift(payload)
                    localStorage.setItem('event_notifications', JSON.stringify(feed.slice(0, 50)))
                    localStorage.setItem('latestEventNotification', JSON.stringify(payload))
                    window.dispatchEvent(new CustomEvent('app:eventNotification', { detail: payload }))
                  } catch (err) {
                    console.error('Failed to send event notification', err)
                  }
                  setSelectedDate(null)
                }}
              >
                Send Notification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}