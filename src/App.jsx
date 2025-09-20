import { useState, useEffect, useRef } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import './App.css'
import TopBar from "./components/TopBar"
import PhotoCarousel from "./components/PhotoCarousel"
import HealthRecords from './components/HealthRecords'
import VideoConsultation from './components/videoConsultation'
import MedicineAvailability from './components/MedicineAvailability'
import MobileTabBar from './components/MobileTabBar'
import SideNav from './components/SideNav'
import ServiceCard from './components/ServiceCard'
import SymptomChecker from './components/SymptomChecker'


function Section({ title, children }) {
  return (
    <section className="bg-white border border-zinc-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm">
      <h2 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">{title}</h2>
      <div>{children}</div>
    </section>
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
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 pb-20 sm:pb-6">
      {/* Hero (full-bleed) */}
      <section className="rounded-none sm:rounded-3xl bg-gradient-to-b from-blue-50 to-transparent p-3 xs:p-4 sm:p-6 lg:p-8 text-center -mx-2 sm:mx-0 lg:-mx-6 xl:-mx-8 3xl:-mx-12">
        <div className="mx-auto mb-3 w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 grid place-items-center text-white text-2xl sm:text-3xl">💙</div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight">Welcome to JanSehat</h1>
        <p className="mt-2 text-sm sm:text-base lg:text-lg text-zinc-600 max-w-2xl mx-auto">Quality healthcare from the comfort of your home</p>

        <div className="mt-4 sm:mt-6 w-full overflow-x-hidden px-2 sm:px-4">
          <PhotoCarousel />
        </div>
      </section>

      {/* Services Section */}
      <div className="space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight text-center lg:text-left">Our Services</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-4 sm:gap-6">
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
      </div>

      <Section title="Find Services">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search doctors, labs, services"
          className="w-full px-4 py-3 rounded-lg bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
        />
      </Section>
    </div>
  )
}

// SymptomChecker component is now imported from separate file


function Layout() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <TopBar />
      <div className="w-full max-w-9xl mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 3xl:px-12">
        <div className="flex flex-col lg:flex-row lg:gap-8 pt-2 sm:pt-4 lg:pt-6">
          <SideNav />
          <main className="flex-1 min-w-0 pb-20 sm:pb-6 lg:pb-8">
            <div className="w-full">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/symptoms" element={<SymptomChecker />} />
                <Route path="/video" element={<VideoConsultation />} />
                <Route path="/records" element={<HealthRecords />} />
                <Route path="/medicine" element={<MedicineAvailability />} />
              </Routes>
            </div>
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


