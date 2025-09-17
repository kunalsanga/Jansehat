import { useState, useEffect, useRef } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import './App.css'
import TopBar from "./components/TopBar"
import PhotoCarousel from "./components/PhotoCarousel"
import HealthRecords from './components/HealthRecords'
import VideoConsultation from './components/VideoConsultation'
import MedicineAvailability from './components/MedicineAvailability'

function MobileTabBar() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-20 bg-white border-t border-zinc-200 sm:hidden">
      <div className="grid grid-cols-5 text-xs">
        <NavLink to="/" end className={({ isActive }) => `px-2 py-3 text-center ${isActive ? 'text-blue-600' : 'text-zinc-500'}`}>Home</NavLink>
        <NavLink to="/symptoms" className={({ isActive }) => `px-2 py-3 text-center ${isActive ? 'text-blue-600' : 'text-zinc-500'}`}>Symptoms</NavLink>
        <NavLink to="/video" className={({ isActive }) => `px-2 py-3 text-center ${isActive ? 'text-blue-600' : 'text-zinc-500'}`}>Video</NavLink>
        <NavLink to="/records" className={({ isActive }) => `px-2 py-3 text-center ${isActive ? 'text-blue-600' : 'text-zinc-500'}`}>Records</NavLink>
        <NavLink to="/medicine" className={({ isActive }) => `px-2 py-3 text-center ${isActive ? 'text-blue-600' : 'text-zinc-500'}`}>Medicine</NavLink>
      </div>
    </nav>
  )
}

function SideNav() {
  const Item = ({ to, label, icon }) => (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md transition ${isActive ? 'bg-blue-50 text-blue-700' : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900'}`}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </NavLink>
  )

  return (
    <aside className="hidden sm:flex sm:flex-col sm:w-64 shrink-0 border-r border-zinc-200 bg-white">
      <div className="px-4 py-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 grid place-items-center text-white text-lg">🩺</div>
      <div>
          <div className="font-semibold">JanSehat</div>
          <div className="text-xs text-zinc-500">Your Health, Our Priority</div>
        </div>
      </div>
      <nav className="flex flex-col px-2 pb-4 gap-1">
        <Item to="/" label="Home" icon="🏠" />
        <Item to="/symptoms" label="Symptom Checker" icon="🩻" />
        <Item to="/video" label="Video Consultation" icon="🎥" />
        <Item to="/records" label="Health Records" icon="📄" />
        <Item to="/medicine" label="Medicine Availability" icon="💊" />
      </nav>
    </aside>
  )
}

function Section({ title, children }) {
  return (
    <section className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
      <h2 className="text-base font-semibold mb-2">{title}</h2>
      <div>{children}</div>
    </section>
  )
}

function ServiceCard({ imgSrc, icon, title, description, to }) {
  return (
    <NavLink
      to={to}
      className="group block rounded-2xl relative overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
    >
      {/* Background image */}
      <img
        src={imgSrc}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Content */}
      <div className="relative p-5 flex items-start gap-4 text-white">
        <div className="w-12 h-12 rounded-xl grid place-items-center text-2xl bg-white/30">{icon}</div>
        <div className="flex-1">
          <div className="text-xl font-semibold mb-1">{title}</div>
          <div className="text-sm leading-snug">{description}</div>
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 group-hover:text-white group-hover:translate-x-0.5 transition">
          ›
        </div>
      </div>
    </NavLink>
  )
}

function Home() {
  const [search, setSearch] = useState('')
  const carouselRef = useRef(null)
  const totalSlides = 3
  const currentIndexRef = useRef(0)

  useEffect(() => {
    const container = carouselRef.current
    if (!container) return

    const id = setInterval(() => {
      const children = container.children
      if (!children || children.length === 0) return
      currentIndexRef.current = (currentIndexRef.current + 1) % children.length
      const nextChild = children[currentIndexRef.current]
      container.scrollTo({ left: nextChild.offsetLeft, behavior: 'smooth' })
    }, 3000)

    function handleResize() {
      const children = container.children
      if (!children || children.length === 0) return
      const child = children[currentIndexRef.current]
      container.scrollTo({ left: child.offsetLeft, behavior: 'instant' })
    }

    window.addEventListener('resize', handleResize)
    return () => {
      clearInterval(id)
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  return (
    <div className="space-y-6 pb-20 sm:pb-6">
      {/* Hero */}
      <section className="rounded-3xl bg-gradient-to-b from-blue-50 to-transparent p-5 sm:p-8 text-center">
        <div className="mx-auto mb-3 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 grid place-items-center text-white text-3xl">💙</div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Welcome to JanSehat</h1>
        <p className="mt-2 text-sm sm:text-base text-zinc-600">Quality healthcare from the comfort of your home</p>

        <div className="mt-6 w-full overflow-x-hidden px-4">
  <PhotoCarousel />
</div>

      
      </section>

      {/* Auto-scrolling photos */}
      

      <div className="text-2xl sm:text-4xl font-bold tracking-tight text-center sm:text-left">Our Services</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ServiceCard
          to="/symptoms"
          imgSrc="/images/symptoms-bg.jpg"
          icon="🩺"
          title="Symptom Checker"
          description="Get instant preliminary diagnosis based on your symptoms"
        />
        <ServiceCard
          to="/video"
          imgSrc="/images/vcDoctor.jpg"
          icon="📹"
          title="Video Consultation"
          description="Connect with certified doctors through video calls"
        />
        <ServiceCard
          to="/records"
          imgSrc="/images/records-bg.jpg"
          icon="📄"
          title="Health Records"
          description="Manage and access your medical history securely"
        />
        <ServiceCard
          to="/medicine"
          imgSrc="/images/medicine-bg.jpg"
          icon="💊"
          title="Medicine Finder"
          description="Check medicine availability at nearby pharmacies"
        />
      </div>

      <Section title="Find Services">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search doctors, labs, services"
          className="w-full px-4 py-3 rounded-lg bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </Section>
    </div>
  )
}

function SymptomChecker() {
  const [symptom, setSymptom] = useState('')
  return (
    <div className="space-y-6 pb-20 sm:pb-6">
      <div className="flex items-center gap-3">
        <NavLink to="/" className="shrink-0 w-9 h-9 rounded-full border border-zinc-200 grid place-items-center hover:bg-zinc-50">←</NavLink>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Symptom Checker</h1>
          <p className="text-sm text-zinc-600">Get preliminary health insights based on your symptoms</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-white border border-zinc-200 shadow-sm">
          <div className="px-5 py-4 border-b border-zinc-200 flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 grid place-items-center">🩺</div>
            <div className="font-semibold">Describe Your Symptoms</div>
          </div>
          <div className="p-5">
            <textarea
              value={symptom}
              onChange={(e) => setSymptom(e.target.value)}
              rows={5}
              placeholder="Please describe your symptoms in detail. For example: 'I have a headache that started this morning, along with a runny nose and slight fever...'"
              className="w-full px-4 py-3 rounded-lg bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="mt-4 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition">
              <span>🔎</span>
              <span>Check Symptoms</span>
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-zinc-200 shadow-sm">
          <div className="p-5 text-center">
            <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-blue-100 text-blue-600 grid place-items-center text-xl">⚠️</div>
            <div className="font-semibold mb-1">Important Notice</div>
            <p className="text-sm text-zinc-600 leading-relaxed">
              This tool provides preliminary guidance only. It is not a substitute for professional medical diagnosis or treatment. Always consult with qualified healthcare professionals for accurate diagnosis and treatment.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


function Layout() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <TopBar />
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="sm:flex sm:gap-6 pt-4 sm:pt-6">
          <SideNav />
          <main className="flex-1 pb-20 sm:pb-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/symptoms" element={<SymptomChecker />} />
              <Route path="/video" element={<VideoConsultation />} />
              <Route path="/records" element={<HealthRecords />} />
              <Route path="/medicine" element={<MedicineAvailability />} />
            </Routes>
          </main>
        </div>
      </div>
      <MobileTabBar />
    </div>
  )
}

export default function App() {
  return <Layout />

}


