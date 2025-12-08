import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function DoctorLogin() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    uid: '',
    name: '',
    phoneNumber: '',
    hospitalName: '',
    hospitalPhoneNumber: '',
    specialization: '',
    address: {
      village: '',
      block: '',
      city: '',
    },
  })

  const [errors, setErrors] = useState({})

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

  const validateForm = () => {
    const newErrors = {}

    if (!formData.uid.trim()) newErrors.uid = 'UID is required'
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required'
    if (!formData.hospitalName.trim()) newErrors.hospitalName = 'Hospital name is required'
    if (!formData.hospitalPhoneNumber.trim()) newErrors.hospitalPhoneNumber = 'Hospital phone number is required'
    if (!formData.specialization.trim()) newErrors.specialization = 'Specialization is required'
    if (!formData.address.village.trim()) newErrors.village = 'Village is required'
    if (!formData.address.block.trim()) newErrors.block = 'Block is required'
    if (!formData.address.city.trim()) newErrors.city = 'City is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      console.log('Form submitted:', formData)
      // Here you would typically send the data to your backend
      alert('Welcome back, Doctor!')
      navigate('/doctor/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-slate-600 hover:text-slate-700 text-sm font-semibold"
      >
        ← Back
      </button>

      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800 mb-2">Doctor Login</h1>
          <p className="text-sm text-slate-600">Please fill in all required fields marked with *</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* UID */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              UID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="uid"
              value={formData.uid}
              onChange={handleInputChange}
              placeholder="Enter your UID"
              className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 ${errors.uid ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-slate-400'
                }`}
            />
            {errors.uid && <p className="text-red-500 text-xs mt-1">{errors.uid}</p>}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-slate-400'
                }`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Enter your 10-digit phone number"
              className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 ${errors.phoneNumber ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-slate-400'
                }`}
            />
            {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
          </div>

          {/* Specialization */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Specialization <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleInputChange}
              placeholder="e.g., General Practitioner, Cardiologist, Pediatrician"
              className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 ${errors.specialization ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-slate-400'
                }`}
            />
            {errors.specialization && <p className="text-red-500 text-xs mt-1">{errors.specialization}</p>}
          </div>

          {/* Hospital Information Section */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-medium text-slate-800 mb-4">Hospital Information <span className="text-red-500">*</span></h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Hospital Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="hospitalName"
                  value={formData.hospitalName}
                  onChange={handleInputChange}
                  placeholder="Enter your hospital name"
                  className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 ${errors.hospitalName ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-slate-400'
                    }`}
                />
                {errors.hospitalName && <p className="text-red-500 text-xs mt-1">{errors.hospitalName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Hospital Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="hospitalPhoneNumber"
                  value={formData.hospitalPhoneNumber}
                  onChange={handleInputChange}
                  placeholder="Enter hospital contact number"
                  className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 ${errors.hospitalPhoneNumber ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-slate-400'
                    }`}
                />
                {errors.hospitalPhoneNumber && <p className="text-red-500 text-xs mt-1">{errors.hospitalPhoneNumber}</p>}
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-medium text-slate-800 mb-4">Address <span className="text-red-500">*</span></h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Village <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address_village"
                  value={formData.address.village}
                  onChange={handleInputChange}
                  placeholder="Enter your village name"
                  className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 ${errors.village ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-slate-400'
                    }`}
                />
                {errors.village && <p className="text-red-500 text-xs mt-1">{errors.village}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Block <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address_block"
                  value={formData.address.block}
                  onChange={handleInputChange}
                  placeholder="Enter your block name"
                  className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 ${errors.block ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-slate-400'
                    }`}
                />
                {errors.block && <p className="text-red-500 text-xs mt-1">{errors.block}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address_city"
                  value={formData.address.city}
                  onChange={handleInputChange}
                  placeholder="Enter your city name"
                  className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 ${errors.city ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-slate-400'
                    }`}
                />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-slate-700 hover:bg-slate-800 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 mt-8"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  )
}

export default DoctorLogin
