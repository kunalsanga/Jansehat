import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import './AshaCalendar.css'

export default function GlobalNotifier() {
  const [notifications, setNotifications] = useState([])
  const [visible, setVisible] = useState(null)

  // Only show notifier inside the patient UI (we treat '/home' as patient dashboard).
  // Do not render on login, ASHA, pharmacist or other pages.
  
  /* Use useLocation for reactive updates on route change */
  const location = useLocation()
  const visiblePath = location.pathname.startsWith('/home')

  if (!visiblePath) return null

  useEffect(() => {
    function readFromStorage() {
      try {
        const raw = localStorage.getItem('event_notifications')
        const feed = raw ? JSON.parse(raw) : []
        // Only keep notifications that appear to be sent by ASHA workers.
        const ashaOnly = feed.filter(item => {
          if (!item) return false
          const src = (item.sender || item.source || item.from || item.role || item.type || '').toString().toLowerCase()
          return src.includes('asha') || src.includes('ashadidi') || src.includes('asha_didi')
        })
        setNotifications(ashaOnly)
        if (ashaOnly.length) setVisible(ashaOnly[0])
      } catch (e) { console.error(e) }
    }

    function handleStorage(e) {
      if (!e) return
      if (e.key === 'event_notifications' || e.key === 'latestEventNotification') {
        readFromStorage()
      }
    }

    function handleCustom(ev) {
      const payload = ev?.detail
      if (!payload) return
      // Only show if payload looks like it came from an ASHA
      const src = (payload.sender || payload.source || payload.from || payload.role || payload.type || '').toString().toLowerCase()
      const isAsha = src.includes('asha') || src.includes('ashadidi') || src.includes('asha_didi')
      if (!isAsha) return
      setNotifications(prev => [payload, ...prev].slice(0, 50))
      setVisible(payload)
    }

    // init
    readFromStorage()
    window.addEventListener('storage', handleStorage)
    window.addEventListener('app:eventNotification', handleCustom)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('app:eventNotification', handleCustom)
    }
  }, [])

  if (!visible) return null

  return (
    <div className="global-notifier" role="alert" aria-live="assertive">
      <div className="global-notifier-card">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-semibold">Event Notification</div>
            <div className="text-xxs text-zinc-600">{new Date(visible.ts).toLocaleString()}</div>
          </div>
          <button className="text-zinc-600" onClick={() => setVisible(null)}>✕</button>
        </div>
        <div className="mt-2">
          <div className="font-semibold">Date: {new Date(visible.date).toLocaleDateString()}</div>
          <div className="mt-1">
            {visible.events && visible.events.length > 0 ? (
              visible.events.map((ev, i) => (
                <div key={i} className="bg-blue-50 p-2 rounded mb-2">
                  <div className="font-semibold">{ev.title}</div>
                  <div className="text-sm text-zinc-700">{ev.desc}</div>
                </div>
              ))
            ) : (
              <div className="p-2 text-zinc-700">No event details.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}