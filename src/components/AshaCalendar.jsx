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

    // initialize from localStorage
    try {
      const raw = localStorage.getItem('emergency_feed')
      const feed = raw ? JSON.parse(raw) : []
      if (feed.length) setEmergencies(feed)
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
    <div className="p-4 sm:p-6">
      {/* Emergency notifications panel for ASHA worker */}
      {emergencies && emergencies.length > 0 && (
        <div className="asha-notifications" aria-live="polite">
          <div className="asha-notifications-header">Emergencies</div>
          {emergencies.slice(0, 5).map((em, idx) => (
            <div key={em.ts || idx} className="asha-notification-item">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{em.id}</div>
                  <div className="text-xxs text-zinc-600">{new Date(em.ts).toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <button className="btn-primary" onClick={() => openMapsFor(em.lat, em.lng)}>Track Location</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-4 asha-card">
        <div className="flex items-center justify-between mb-3">
          <button className="btn-nav" onClick={prevMonth} aria-label="Previous month">◀</button>
          <div className="text-center">
            <div className="text-lg font-bold">{MONTHS[currentMonth]}</div>
            <div className="text-sm text-zinc-600">{currentYear}</div>
          </div>
          <button className="btn-nav" onClick={nextMonth} aria-label="Next month">▶</button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="py-1 text-zinc-700">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
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
                  className={`p-2 rounded-lg focus:outline-none h-14 flex flex-col items-center justify-center ${date ? 'bg-zinc-50' : 'bg-transparent'} ${isToday ? 'ring-2 ring-blue-400' : ''} ${colorClass}`}
                  disabled={!date}
                >
                  <div className="text-base font-medium">{date ? date.getDate() : ''}</div>
                  <div className="text-xxs mt-1">
                    {dayEvents ? <span className={`event-dot ${eventType}`}></span> : null}
                  </div>
                </button>
              )
            })
          ))}
        </div>

        <div className="mt-4 text-sm text-zinc-600">
          <strong>Tip:</strong> Tap a date to see events. Large text and simple icons for easy reading.
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