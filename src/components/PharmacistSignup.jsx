import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function PharmacistSignup() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    address: {
      village: '',
      block: '',
      city: '',
      pincode: '',
      state: '',
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
    
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required'
    if (!formData.address.village.trim()) newErrors.village = 'Village is required'
    if (!formData.address.block.trim()) newErrors.block = 'Block is required'
    if (!formData.address.city.trim()) newErrors.city = 'City is required'
    if (!formData.address.pincode.trim()) newErrors.pincode = 'Pincode is required'
    if (!formData.address.state.trim()) newErrors.state = 'State is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      console.log('Form submitted:', formData)
      // Here you would typically send the data to your backend
      alert('Account created successfully!')
      navigate('/login')
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
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800 mb-2">Pharmacist Signup</h1>
          <p className="text-sm text-slate-600">Please fill in all required fields marked with *</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 ${
                errors.name ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-slate-400'
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
              className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 ${
                errors.phoneNumber ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-slate-400'
              }`}
            />
            {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
          </div>

          {/* Email (Optional) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email (optional)"
              className="w-full px-4 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
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
                  className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 ${
                    errors.village ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-slate-400'
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
                  className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 ${
                    errors.block ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-slate-400'
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
                  className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 ${
                    errors.city ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-slate-400'
                  }`}
                />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address_pincode"
                  value={formData.address.pincode}
                  onChange={handleInputChange}
                  placeholder="Enter your 6-digit pincode"
                  className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 ${
                    errors.pincode ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-slate-400'
                  }`}
                />
                {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address_state"
                  value={formData.address.state}
                  onChange={handleInputChange}
                  placeholder="Enter your state name"
                  className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 ${
                    errors.state ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-slate-400'
                  }`}
                />
                {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
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

export default PharmacistSignup
