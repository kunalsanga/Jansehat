import { useState, useEffect, useRef } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import './App.css'
import TopBar from "./components/TopBar"


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


function PhotoCarousel() {
  const carouselRef = useRef(null)
  const currentIndexRef = useRef(0)

  const photos = [
    '/images/photo1.jpg',
    '/images/photo2.jpg',
    '/images/photo3.jpg',
    '/images/photo4.jpg',
    '/images/photo5.jpg',
    
  ]

  useEffect(() => {
    const container = carouselRef.current
    if (!container) return

    const interval = setInterval(() => {
      const children = container.children
      if (!children || children.length === 0) return

      // calculate next scroll position
      const containerWidth = container.offsetWidth
      currentIndexRef.current += 1
      if (currentIndexRef.current >= children.length) currentIndexRef.current = 0

      const nextChild = children[currentIndexRef.current]
      const scrollLeft = nextChild.offsetLeft - (containerWidth - nextChild.offsetWidth) / 2

      container.scrollTo({ left: scrollLeft, behavior: 'smooth' })
    }, 2000)

    return () => clearInterval(interval)
  }, [photos.length])

  return (
    <div className="w-full overflow-hidden">
      <div
        ref={carouselRef}
        className="flex gap-4 overflow-x-hidden"
      >
        {photos.map((src, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-36 h-36"
          >
            <img
              src={src}
              alt={`Photo ${idx + 1}`}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
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

function VideoConsultation() {
  return (
    <div className="space-y-6 pb-20 sm:pb-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <NavLink to="/" className="shrink-0 w-9 h-9 rounded-full border border-zinc-200 grid place-items-center hover:bg-zinc-50">←</NavLink>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Book Your Consultation</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: form */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-zinc-200 shadow-sm">
          <div className="px-5 py-4 border-b border-zinc-200 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 grid place-items-center">📅</div>
            <div className="font-semibold">Book Your Consultation</div>
          </div>
          <form className="p-5 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Patient Name *</label>
                <input type="text" placeholder="Enter your full name" className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number *</label>
                <input type="tel" placeholder="Enter your phone number" className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Preferred Date *</label>
                <div className="relative">
                  <input type="date" className="w-full px-3 py-2 pr-10 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">📅</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Preferred Time *</label>
                <select className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Select time</option>
                  <option>09:00 AM</option>
                  <option>10:00 AM</option>
                  <option>11:00 AM</option>
                  <option>12:00 PM</option>
                  <option>02:00 PM</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Consultation Type</label>
              <select className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Video Call</option>
                <option>Audio Call</option>
                <option>Chat</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Describe Your Symptoms *</label>
              <textarea rows="5" placeholder="Please describe your symptoms and any relevant medical history..." className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button type="button" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition">
              <span>📞</span>
              <span>Book Consultation</span>
            </button>
          </form>
        </div>

        {/* Right: info cards */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-200 shadow-sm p-5 bg-gradient-to-b from-green-50 to-white">
            <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 grid place-items-center text-xl mb-3">⏰</div>
            <div className="font-semibold mb-2">Available Hours</div>
            <div className="text-sm">
              <div className="flex justify-between py-1 border-b border-zinc-100"><span>Monday - Friday:</span><span className="font-medium">9:00 AM - 6:00 PM</span></div>
              <div className="flex justify-between py-1 border-b border-zinc-100"><span>Saturday:</span><span className="font-medium">9:00 AM - 2:00 PM</span></div>
              <div className="flex justify-between py-1"><span>Sunday:</span><span className="text-red-600 font-medium">Closed</span></div>
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-200 shadow-sm p-5">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 grid place-items-center text-xl mb-3">👤</div>
            <div className="font-semibold mb-2">What to Expect</div>
            <ul className="text-sm list-disc pl-5 space-y-1 text-zinc-700">
              <li>Secure video consultation</li>
              <li>Certified medical professionals</li>
              <li>Digital prescription (if needed)</li>
              <li>Follow-up care recommendations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function HealthRecords() {
  const [tab, setTab] = useState('profile')
  return (
    <div className="space-y-6 pb-20 sm:pb-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <NavLink to="/" className="shrink-0 w-9 h-9 rounded-full border border-zinc-200 grid place-items-center hover:bg-zinc-50">←</NavLink>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Health Records</h1>
          <p className="text-sm text-zinc-600">Manage your medical information securely</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button onClick={() => setTab('profile')} className={`px-4 py-2 rounded-xl border ${tab==='profile' ? 'bg-white border-zinc-300 shadow-sm' : 'border-zinc-200 hover:bg-zinc-50'}`}>
          <span className="mr-2">👤</span>Profile
        </button>
        <button onClick={() => setTab('history')} className={`px-4 py-2 rounded-xl border ${tab==='history' ? 'bg-white border-zinc-300 shadow-sm' : 'border-zinc-200 hover:bg-zinc-50'}`}>
          <span className="mr-2">🩺</span>Medical History
        </button>
      </div>

      {/* Card */}
      <div className="rounded-2xl bg-white border border-zinc-200 shadow-sm">
        <div className="px-5 py-4 border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 grid place-items-center">🧑‍⚕️</div>
            <div className="font-semibold">Patient Profile</div>
          </div>
          <button className="px-3 py-2 rounded-lg border border-zinc-300 hover:bg-zinc-50 text-sm">Edit Profile</button>
        </div>

        {tab === 'profile' && (
          <div className="p-5 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input type="text" placeholder="Enter your full name" className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Age</label>
                <input type="number" placeholder="Enter your age" className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input type="tel" placeholder="Enter your phone number" className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Select gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Emergency Contact</label>
              <input type="tel" placeholder="Emergency contact number" className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        )}

        {tab === 'history' && (
          <div className="p-5 space-y-4">
            <div className="rounded-xl border border-zinc-200 p-4">
              <div className="font-medium mb-2">Allergies</div>
              <input type="text" placeholder="e.g., Penicillin, Peanuts" className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="rounded-xl border border-zinc-200 p-4">
              <div className="font-medium mb-2">Current Medications</div>
              <textarea rows="3" placeholder="List any medications you are currently taking" className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="rounded-xl border border-zinc-200 p-4">
              <div className="font-medium mb-2">Past Surgeries / Conditions</div>
              <textarea rows="3" placeholder="Provide relevant medical history" className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function MedicineAvailability() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All Medicines')

  const categories = [
    'All Medicines',
    'Pain Relief',
    'Fever',
    'Cold & Flu',
    'Digestive',
    'Cardiac',
    'Diabetic',
    'Antibiotic',
    'Other',
  ]

  const medicines = [
    {
      id: 1,
      name: 'Cough Syrup',
      brand: 'Benadryl',
      tags: ['Cold & Flu'],
      stock: 'Low Stock',
      price: 75,
      pharmacy: 'Family Pharmacy, Residential Area',
      dosage: '10ml - 2 times daily',
      expires: '7/10/2025',
      category: 'Cold & Flu',
    },
    {
      id: 2,
      name: 'Amoxicillin',
      brand: 'Novamox',
      tags: ['Antibiotic'],
      stock: 'In Stock',
      price: 85,
      pharmacy: 'Apollo Pharmacy, Central Plaza',
      dosage: '500mg - 1 capsule 3 times daily',
      expires: '6/30/2025',
      category: 'Antibiotic',
    },
    {
      id: 3,
      name: 'Paracetamol 650',
      brand: 'Dolo',
      tags: ['Fever', 'Pain Relief'],
      stock: 'In Stock',
      price: 40,
      pharmacy: 'City Care Pharmacy, Market Road',
      dosage: '650mg - after meals',
      expires: '3/15/2026',
      category: 'Fever',
    },
    {
      id: 4,
      name: 'Omeprazole',
      brand: 'Omez',
      tags: ['Digestive'],
      stock: 'Limited',
      price: 120,
      pharmacy: 'Wellness Chemist, Main Street',
      dosage: '20mg - once daily',
      expires: '11/30/2025',
      category: 'Digestive',
    },
  ]

  const filtered = medicines.filter((m) => {
    const matchesQuery = [m.name, m.brand, m.pharmacy].join(' ').toLowerCase().includes(query.toLowerCase())
    const matchesCat = category === 'All Medicines' || m.category === category
    return matchesQuery && matchesCat
  })

  function StockBadge({ stock }) {
    const style = stock === 'In Stock'
      ? 'bg-green-100 text-green-700'
      : stock === 'Low Stock' || stock === 'Limited'
      ? 'bg-yellow-100 text-yellow-700'
      : 'bg-zinc-100 text-zinc-700'
    return <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${style}`}><span className="text-[10px]">⏺</span>{stock}</span>
  }

  return (
    <div className="space-y-6 pb-20 sm:pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1">
          <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-2">
            <div className="flex items-center gap-2 rounded-xl bg-white border border-zinc-200 px-3 py-2">
              <span>🔎</span>
              <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search for medicines..." className="w-full outline-none" />
            </div>
          </div>
        </div>
        <select value={category} onChange={(e)=>setCategory(e.target.value)} className="w-full sm:w-64 px-3 py-2 rounded-xl border border-zinc-300">
          {categories.map((c)=> <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="space-y-5">
        {filtered.map((m)=> (
          <div key={m.id} className="rounded-2xl bg-white border border-zinc-200 shadow-sm p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 grid place-items-center">💊</div>
                  <div>
                    <div className="text-xl font-semibold">{m.name}</div>
                    <div className="text-sm text-zinc-500">Brand: {m.brand}</div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {m.tags.map((t)=> <span key={t} className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">{t}</span>)}
                  <StockBadge stock={m.stock} />
                </div>
              </div>
              <button className="hidden sm:inline-flex px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600">Order Now</button>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2"><span>📍</span><span>{m.pharmacy}</span></div>
              <div className="flex items-center gap-2"><span className="font-medium">Dosage:</span><span>{m.dosage}</span></div>
              <div className="flex items-center gap-2"><span className="font-medium">Expires:</span><span>{m.expires}</span></div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="text-sm">Price: <span className="text-green-600 font-semibold">₹{m.price}</span></div>
              <button className="sm:hidden inline-flex px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600">Order Now</button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center text-sm text-zinc-500">No results found. Try a different search or category.</div>
        )}
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


