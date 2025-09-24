import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, Route, Routes } from 'react-router-dom'
import './App.css'
import VoiceCommandMic from "./components/VoiceCommandMic";
import TopBar from "./components/TopBar"
import PhotoCarousel from "./components/PhotoCarousel"
import HealthRecords from './components/HealthRecords'
import VideoConsultation from './components/videoConsultation'
import MedicineAvailability from './components/MedicineAvailability'
import MobileTabBar from './components/MobileTabBar'
import SideNav from './components/SideNav'
import ServiceCard from './components/ServiceCard'
import SymptomChecker from './components/SymptomChecker'
import EmergencyMode from './components/EmergencyMode'
import HospitalNavigation from './components/HospitalNavigation'


function Section({ title, children }) {
  return (
    <section className="bg-white border border-zinc-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm">
      <h2 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">{title}</h2>
      <div>{children}</div>
    </section>
  )
}

function Home() {
  const { t } = useTranslation()
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
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Hero (full-bleed) */}
      <section className="rounded-none sm:rounded-3xl bg-gradient-to-b from-blue-50 to-transparent p-3 xs:p-4 sm:p-6 lg:p-8 text-center -mx-2 sm:mx-0 lg:-mx-6 xl:-mx-8 3xl:-mx-12">
        <div className="mx-auto mb-3 w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl bg-white shadow-lg p-2 sm:p-3">
          <img 
            src="/jansehat-logo.svg" 
            alt="JanSehat Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight">{t('home.welcome')}</h1>
        <p className="mt-2 text-sm sm:text-base lg:text-lg text-zinc-600 max-w-2xl mx-auto">{t('home.qualityCare')}</p>

        <div className="mt-4 sm:mt-6 w-full overflow-x-hidden px-2 sm:px-4">
          <PhotoCarousel />
        </div>
      </section>

      {/* Services Section */}
      <div className="space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight text-center lg:text-left">{t('home.services')}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-4 sm:gap-6">
          <ServiceCard
            to="/symptoms"
            imgSrc="/images/custom/istockphoto-1680653991-612x612.jpg"
            icon="🩺"
            title={t('home.symptomChecker')}
            description={t('home.descSymptom')}
          />
          <ServiceCard
            to="/video"
            imgSrc="/images/vcDoctor.jpg"
            icon="📹"
            title={t('home.videoConsultation')}
            description={t('home.descVideo')}
          />
          <ServiceCard
            to="/records"
            imgSrc="/health-records.jpg"
            icon="📄"
            title={t('home.healthRecords')}
            description={t('home.descRecords')}
          />
          <ServiceCard
            to="/medicine"
            imgSrc="/generated-image (3).png"
            icon="💊"
            title={t('home.medicineFinder')}
            description={t('home.descMedicine')}
          />
          <ServiceCard
            to="/emergency"
            imgSrc="/images/custom/2021-05-05T115931Z_1_LYNXMPEH440PR_RTROPTP_4_HEALTH-CORONAVIRUS-INDIA.jpg"
            icon="🚨"
            title={t('home.emergencyMode')}
            description={t('home.descEmergency')}
          />
          <ServiceCard
            to="/navigation"
            imgSrc="/gps-map-navigator-concept-street-maps-directions-vector-illustration_230920-2779.jpg"
            icon="🗺️"
            title={t('home.hospitalNavigation')}
            description={t('home.descNavigation')}
          />
        </div>
      </div>

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
          <main className="flex-1 min-w-0 pb-24 sm:pb-6 lg:pb-8 mobile-container">
            <div className="w-full">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/symptoms" element={<SymptomChecker />} />
                <Route path="/video" element={<VideoConsultation />} />
                <Route path="/records" element={<HealthRecords />} />
                <Route path="/medicine" element={<MedicineAvailability />} />
                <Route path="/emergency" element={<EmergencyMode />} />
                <Route path="/navigation" element={<HospitalNavigation />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
      <VoiceCommandMic />
      <MobileTabBar />
    </div>
  )
}

export default function App() {
  return <Layout />

}


