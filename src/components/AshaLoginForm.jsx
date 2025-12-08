import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AshaLoginForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    chwid: '',
    phoneNumber: '',
  })

  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.chwid.trim()) newErrors.chwid = 'CHVW ID is required'
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      console.log('Login submitted:', formData)
      // Here you would typically verify credentials with your backend
      alert('Login successful!')
      // Redirect to Asha UI/dashboard
      navigate('/asha')
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

      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800 mb-2">Asha Didi Login</h1>
          <p className="text-sm text-slate-600">Enter your details to login</p>
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

          {/* CHVW ID */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              CHVW ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="chwid"
              value={formData.chwid}
              onChange={handleInputChange}
              placeholder="Enter your CHVW ID"
              className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 ${
                errors.chwid ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-slate-400'
              }`}
            />
            {errors.chwid && <p className="text-red-500 text-xs mt-1">{errors.chwid}</p>}
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-slate-700 hover:bg-slate-800 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 mt-8"
          >
            Login
          </button>
        </form>

        {/* Don't have account link */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            Don't have an account?{' '}
            <button 
              onClick={() => navigate('/login/asha/signup')}
              className="text-slate-700 hover:text-slate-900 underline font-medium"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AshaLoginForm
