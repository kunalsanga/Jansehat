import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// --- TRANSLATION DATA (Shared Dictionary) ---
// Note: Only English (en) and Hindi (hi) are defined here for the form fields.
const TRANSLATIONS = {
  en: {
    // UI Elements
    back: '← Back',
    title: 'Patient Registration',
    subtitle: 'Please fill in all required fields marked with *',
    address_heading: 'Address',
    additional_info: 'Additional Information (Optional)',
    submit_button: 'Create Account',
    signin_prompt: 'Already have an account?',
    signin_button: 'Sign in',
    select_blood: 'Select blood group',

    // Form Labels
    abhaid: 'ABHA ID',
    name: 'Full Name',
    age: 'Age',
    dob: 'Date of Birth',
    phone: 'Phone Number',
    village: 'Village',
    block: 'Block',
    city: 'City',
    blood: 'Blood Group',
    email: 'Email',
    height: 'Height (cm)',
    weight: 'Weight (kg)',

    // Placeholder Text
    ph_abhaid: 'Enter your ABHA ID',
    ph_name: 'Enter your full name',
    ph_age: 'Enter your age',
    ph_phone: 'Enter your 10-digit phone number',
    ph_village: 'Enter your village name',
    ph_block: 'Enter your block name',
    ph_city: 'Enter your city name',
    ph_email: 'Enter your email (optional)',
    ph_height: 'Enter your height in cm',
    ph_weight: 'Enter your weight in kg',


    // Validation Errors
    err_abhaid: 'ABHA ID is required',
    err_name: 'Name is required',
    err_age: 'Please enter valid age',
    err_phone: 'Phone number is required',
    err_dob: 'Date of birth is required',
    err_village: 'Village is required',
    err_block: 'Block is required',
    err_city: 'City is required',
  },
  hi: {
    // UI Elements
    back: '← वापस',
    title: 'रोगी पंजीकरण',
    subtitle: 'कृपया * से चिह्नित सभी आवश्यक फ़ील्ड भरें',
    address_heading: 'पता',
    additional_info: 'अतिरिक्त जानकारी (वैकल्पिक)',
    submit_button: 'खाता बनाएं',
    signin_prompt: 'पहले से ही एक खाता है?',
    signin_button: 'साइन इन करें',
    select_blood: 'रक्त समूह चुनें',

    // Form Labels
    abhaid: 'आभा आईडी',
    name: 'पूरा नाम',
    age: 'आयु',
    dob: 'जन्मतिथि',
    phone: 'फ़ोन नंबर',
    village: 'गाँव',
    block: 'ब्लॉक',
    city: 'शहर',
    blood: 'रक्त समूह',
    email: 'ईमेल',
    height: 'ऊंचाई (सेमी)',
    weight: 'वजन (किग्रा)',

    // Placeholder Text
    ph_abhaid: 'अपनी आभा आईडी दर्ज करें',
    ph_name: 'अपना पूरा नाम दर्ज करें',
    ph_age: 'अपनी आयु दर्ज करें',
    ph_phone: 'अपना 10 अंकों का फ़ोन नंबर दर्ज करें',
    ph_village: 'अपने गाँव का नाम दर्ज करें',
    ph_block: 'अपना ब्लॉक नाम दर्ज करें',
    ph_city: 'अपना शहर नाम दर्ज करें',
    ph_email: 'अपना ईमेल दर्ज करें (वैकल्पिक)',
    ph_height: 'अपनी ऊंचाई सेमी में दर्ज करें',
    ph_weight: 'अपना वजन किलोग्राम में दर्ज करें',


    // Validation Errors
    err_abhaid: 'आधार आईडी आवश्यक है',
    err_name: 'नाम आवश्यक है',
    err_age: 'कृपया वैध आयु दर्ज करें',
    err_phone: 'फ़ोन नंबर आवश्यक है',
    err_dob: 'जन्मतिथि आवश्यक है',
    err_village: 'गाँव आवश्यक है',
    err_block: 'ब्लॉक आवश्यक है',
    err_city: 'शहर आवश्यक है',
  },
}
// --- END TRANSLATION DATA ---

function PatientLogin() {
  const navigate = useNavigate()

  // STATE 1: LANGUAGE PERSISTENCE - Loads language from localStorage (KEEP)
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('appLanguage') || 'en'
  })

  // STATE 2: Form data (MERGED)
  const [formData, setFormData] = useState({
    abhaid: '',
    name: '',
    age: '',
    phoneNumber: '',
    dob: '',
    address: {
      village: '',
      block: '',
      city: '',
    },
    bloodGroup: '',
    email: '',
    height: '',
    weight: '',
  })

  const [errors, setErrors] = useState({})

  // EFFECT: Saves language preference immediately if changed on this page (KEEP)
  useEffect(() => {
    localStorage.setItem('appLanguage', language)
  }, [language])

  // GETTER: Translation object (t) (KEEP)
  const t = TRANSLATIONS[language] || TRANSLATIONS.en

  // HANDLER: Language toggle (en <-> hi) (KEEP)
  const handleLanguageChange = () => {
    setLanguage(prev => (prev === 'en' ? 'hi' : 'en'))
  }

  // HANDLER: Input change (MERGED)
  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('address_')) {
      const addressField = name.replace('address_', '')
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  // VALIDATION: Uses translated strings for errors (MERGED & TRANSLATED)
  const validateForm = () => {
    const newErrors = {}

    if (!formData.abhaid.trim()) newErrors.abhaid = t.err_abhaid
    if (!formData.name.trim()) newErrors.name = t.err_name
    if (!formData.age || formData.age < 0 || formData.age > 150) newErrors.age = t.err_age
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = t.err_phone
    if (!formData.dob) newErrors.dob = t.err_dob
    if (!formData.address.village.trim()) newErrors.village = t.err_village
    if (!formData.address.block.trim()) newErrors.block = t.err_block
    if (!formData.address.city.trim()) newErrors.city = t.err_city

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // HANDLER: Submission (MERGED)
  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      console.log('Form submitted:', formData)
      alert('Account created successfully!')
      navigate('/login/patient')
    }
  }

  // Get current language emoji/name for button display (KEEP)
  const currentLangDisplay = language === 'en' ? { name: 'English', emoji: '🇬🇧' } : { name: 'हिन्दी', emoji: '🇮🇳' }

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 relative">

      {/* LANGUAGE BUTTON (KEEP) */}
      <button
        onClick={handleLanguageChange}
        className="absolute top-4 right-4 bg-purple-100 hover:bg-purple-200 border border-purple-300 text-purple-800 rounded-full py-2 px-4 transition-colors duration-200 flex items-center gap-2 text-sm font-medium shadow-md z-10"
      >
        <span className="text-xl">{currentLangDisplay.emoji}</span>
        {currentLangDisplay.name}
      </button>

      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-slate-600 hover:text-slate-700 text-sm font-semibold"
      >
        {t.back} {/* TRANSLATED */}
      </button>

      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800 mb-2">{t.title}</h1> {/* TRANSLATED */}
          <p className="text-sm text-slate-600">{t.subtitle}</p> {/* TRANSLATED */}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ABHA ID */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t.abhaid} <span className="text-red-500">*</span> {/* TRANSLATED */}
            </label>
            <input
              type="text"
              name="abhaid"
              value={formData.abhaid}
              onChange={handleInputChange}
              placeholder={t.ph_abhaid}
              className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 ${errors.abhaid ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-slate-400'
                }`}
            />
            {errors.abhaid && <p className="text-red-500 text-xs mt-1">{errors.abhaid}</p>}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t.name} <span className="text-red-500">*</span> {/* TRANSLATED */}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder={t.ph_name}
              className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-slate-400'
                }`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Age and DOB */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t.age} <span className="text-red-500">*</span> {/* TRANSLATED */}
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                placeholder={t.ph_age}
                min="0"
                max="150"
                className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 ${errors.age ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-slate-400'
                  }`}
              />
              {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t.dob} <span className="text-red-500">*</span> {/* TRANSLATED */}
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 ${errors.dob ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-slate-400'
                  }`}
              />
              {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t.phone} <span className="text-red-500">*</span> {/* TRANSLATED */}
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder={t.ph_phone}
              className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 ${errors.phoneNumber ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-slate-400'
                }`}
            />
            {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
          </div>

          {/* Address Section */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-medium text-slate-800 mb-4">{t.address_heading} <span className="text-red-500">*</span></h2> {/* TRANSLATED */}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t.village} <span className="text-red-500">*</span> {/* TRANSLATED */}
                </label>
                <input
                  type="text"
                  name="address_village"
                  value={formData.address.village}
                  onChange={handleInputChange}
                  placeholder={t.ph_village}
                  className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 ${errors.village ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-slate-400'
                    }`}
                />
                {errors.village && <p className="text-red-500 text-xs mt-1">{errors.village}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t.block} <span className="text-red-500">*</span> {/* TRANSLATED */}
                </label>
                <input
                  type="text"
                  name="address_block"
                  value={formData.address.block}
                  onChange={handleInputChange}
                  placeholder={t.ph_block}
                  className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 ${errors.block ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-slate-400'
                    }`}
                />
                {errors.block && <p className="text-red-500 text-xs mt-1">{errors.block}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t.city} <span className="text-red-500">*</span> {/* TRANSLATED */}
                </label>
                <input
                  type="text"
                  name="address_city"
                  value={formData.address.city}
                  onChange={handleInputChange}
                  placeholder={t.ph_city}
                  className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 ${errors.city ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-slate-400'
                    }`}
                />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>
            </div>
          </div>

          {/* Optional Fields */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-medium text-slate-800 mb-4">{t.additional_info}</h2> {/* TRANSLATED */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t.blood} {/* TRANSLATED */}
                </label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
                >
                  <option value="">{t.select_blood}</option> {/* TRANSLATED */}
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t.email} {/* TRANSLATED */}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t.ph_email}
                  className="w-full px-4 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t.height} {/* TRANSLATED */}
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  placeholder={t.ph_height}
                  className="w-full px-4 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t.weight} {/* TRANSLATED */}
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder={t.ph_weight}
                  className="w-full px-4 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-slate-700 hover:bg-slate-800 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 mt-8"
          >
            {t.submit_button} {/* TRANSLATED */}
          </button>
        </form>

        {/* Already have account link */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            {t.signin_prompt}{' '} {/* TRANSLATED */}
            <button
              onClick={() => navigate('/login/patient')}
              className="text-slate-700 hover:text-slate-900 underline font-medium"
            >
              {t.signin_button} {/* TRANSLATED */}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default PatientLogin