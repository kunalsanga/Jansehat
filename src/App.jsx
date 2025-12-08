import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, Route, Routes, Navigate, useNavigate, useLocation, Outlet } from 'react-router-dom'
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
import AshaCalendar from './components/AshaCalendar'
import GlobalNotifier from './components/GlobalNotifier'
import LoginRoleSelection from './components/LoginRoleSelection'
import PatientLogin from './components/PatientLogin'
import PatientLoginForm from './components/PatientLoginForm'
import AshaLogin from './components/AshaLogin'
import AshaLoginForm from './components/AshaLoginForm'
import DoctorLogin from './components/DoctorLogin'
import PharmacistLogin from './components/PharmacistLogin'
import SignupRoleSelection from './components/SignupRoleSelection'
import PatientSignup from './components/PatientSignup'
import AshaSignup from './components/AshaSignup'
import DoctorSignup from './components/DoctorSignup'
import PharmacistDashboard from './components/PharmacistDashboard'
import PharmacistSignup from './components/PharmacistSignup'
import ConsultationDashboard from './components/ConsulationDashboard'
import ErrorBoundary from './components/ErrorBoundary'

function Section({ title, children }) {
    return (
        <section className="bg-white border border-zinc-100 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-brand-500 rounded-full"></span>
                {title}
            </h2>
            <div>{children}</div>
        </section>
    )
}

function Home() {
    const { t } = useTranslation()
    const navigate = useNavigate()

    return (
        <div className="space-y-8 sm:space-y-10 lg:space-y-12 pb-10">
            {/* Hero (full-bleed) */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-50 via-white to-blue-50 border border-brand-100/50 shadow-sm p-6 sm:p-10 lg:p-12 text-center">

                {/* Decorative background elements */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-brand-100/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl translate-x-1/4 translate-y-1/4"></div>

                <div className="relative z-10 flex flex-col items-center">
                    <div className="mb-6 p-4 bg-white rounded-2xl shadow-md shadow-brand-100/50">
                        <img
                            src="/logo.jpg"
                            alt="App Logo"
                            className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                        />
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
                        {t('home.welcome')}
                    </h1>
                    <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
                        {t('home.qualityCare')}
                    </p>

                    <div className="mt-8 sm:mt-10 w-full max-w-4xl mx-auto overflow-hidden rounded-2xl shadow-lg border-4 border-white">
                        <PhotoCarousel />
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-800">
                        {t('home.services')}
                    </h2>
                    <span className="text-sm font-medium text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
                        Explore All
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 sm:gap-6">
                    <ServiceCard
                        to="/symptoms"
                        imgSrc="/images/custom/istockphoto-1680653991-612x612.jpg"
                        icon="🩺"
                        title={t('home.symptomChecker')}
                        description={t('home.descSymptom')}
                        color="blue"
                    />
                    <ServiceCard
                        to="/video"
                        imgSrc="/images/vcDoctor.jpg"
                        icon="📹"
                        title={t('home.videoConsultation')}
                        description={t('home.descVideo')}
                        color="indigo"
                    />
                    <ServiceCard
                        to="/records"
                        imgSrc="/health-records.jpg"
                        icon="📄"
                        title={t('home.healthRecords')}
                        description={t('home.descRecords')}
                        color="emerald"
                    />
                    <ServiceCard
                        to="/medicine"
                        imgSrc="/generated-image (3).png"
                        icon="💊"
                        title={t('home.medicineFinder')}
                        description={t('home.descMedicine')}
                        color="teal"
                    />
                    <ServiceCard
                        to="/emergency"
                        imgSrc="/images/custom/2021-05-05T115931Z_1_LYNXMPEH440PR_RTROPTP_4_HEALTH-CORONAVIRUS-INDIA.jpg"
                        icon="🚨"
                        title={t('home.emergencyMode')}
                        description={t('home.descEmergency')}
                        color="red"
                    />
                    <ServiceCard
                        to="/navigation"
                        imgSrc="/gps-map-navigator-concept-street-maps-directions-vector-illustration_230920-2779.jpg"
                        icon="🗺️"
                        title={t('home.hospitalNavigation')}
                        description={t('home.descNavigation')}
                        color="cyan"
                    />
                    <ServiceCard
                        to="/asha"
                        imgSrc="/images/custom/asha-calendar.jpg"
                        icon="👩‍⚕️"
                        title="ASHA Calendar"
                        description="Open calendar for local events: vaccination, polio drops, health camps."
                        color="purple"
                    />
                </div>
            </div>
        </div>
    )
}

function MainLayout() {
    const location = useLocation()
    const hideSideNav = location.pathname.startsWith('/pharmacist') || location.pathname.startsWith('/asha')

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-brand-100 selection:text-brand-900">
            <TopBar />
            <GlobalNotifier />
            <div className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col lg:flex-row lg:gap-10">
                    {!hideSideNav && (
                        <aside className="hidden lg:block w-64 flex-shrink-0">
                            <div className="sticky top-24">
                                <SideNav />
                            </div>
                        </aside>
                    )}
                    <main className="flex-1 min-w-0 pb-24 lg:pb-10">
                        <ErrorBoundary>
                            <Outlet />
                        </ErrorBoundary>
                    </main>
                </div>
            </div>
            <VoiceCommandMic />
            <MobileTabBar />
        </div>
    )
}

export default function App() {
    return (
        <ErrorBoundary>
            <Routes>
                {/* Auth / Public Routes */}
                <Route path="/login" element={<LoginRoleSelection />} />
                <Route path="/login/patient" element={<PatientLoginForm />} />
                <Route path="/login/patient/signup" element={<PatientLogin />} />
                <Route path="/login/asha" element={<AshaLoginForm />} />
                <Route path="/login/asha/signup" element={<AshaLogin />} />
                <Route path="/login/doctor" element={<DoctorLogin />} />
                <Route path="/login/pharmacist" element={<PharmacistLogin />} />
                <Route path="/signup" element={<SignupRoleSelection />} />
                <Route path="/signup/patient" element={<PatientSignup />} />
                <Route path="/signup/asha" element={<AshaSignup />} />
                <Route path="/signup/doctor" element={<DoctorSignup />} />
                <Route path="/signup/pharmacist" element={<PharmacistSignup />} />

                {/* Main Layout Routes */}
                <Route element={<MainLayout />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/symptoms" element={<SymptomChecker />} />
                    <Route path="/video" element={<VideoConsultation />} />
                    <Route path="/records" element={<HealthRecords />} />
                    <Route path="/medicine" element={<MedicineAvailability />} />
                    <Route path="/pharmacist" element={<PharmacistDashboard />} />
                    <Route path="/emergency" element={<EmergencyMode />} />
                    <Route path="/navigation" element={<HospitalNavigation />} />
                    <Route path="/asha" element={<AshaCalendar />} />
                    <Route path="/doctor/dashboard" element={<ConsultationDashboard />} />
                </Route>

                {/* Redirect Root to Login */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </ErrorBoundary>
    )
}