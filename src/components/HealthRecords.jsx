import React, { useState } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'

function HealthRecords() {
    const [tab, setTab] = useState('profile')
    const [editingProfile, setEditingProfile] = useState(false)
    const [profileData, setProfileData] = useState({
        fullName: 'Dr. Sarah Johnson',
        age: 34,
        phone: '+1 (555) 123-4567',
        gender: 'Female',
        emergencyContact: '+1 (555) 987-6543',
        bloodType: 'O+',
        height: '5\'6"',
        weight: '140 lbs',
        allergies: 'Penicillin, Shellfish, Latex',
        currentMedications: 'Metformin 500mg daily, Lisinopril 10mg daily',
        pastSurgeries: 'Appendectomy (2018), Gallbladder removal (2020)',
        chronicConditions: 'Type 2 Diabetes, Hypertension',
        insuranceProvider: 'Blue Cross Blue Shield',
        policyNumber: 'BC123456789'
    })

    // Comprehensive dummy data
    const medicalHistory = [
        {
            id: 1,
            date: '2024-01-15',
            doctor: 'Dr. Michael Chen',
            specialty: 'Cardiology',
            diagnosis: 'Hypertension',
            treatment: 'Prescribed Lisinopril 10mg daily',
            status: 'Ongoing',
            notes: 'Blood pressure well controlled with medication'
        },
        {
            id: 2,
            date: '2023-12-03',
            doctor: 'Dr. Emily Rodriguez',
            specialty: 'Endocrinology',
            diagnosis: 'Type 2 Diabetes',
            treatment: 'Metformin 500mg twice daily, dietary counseling',
            status: 'Ongoing',
            notes: 'HbA1c improved from 8.2% to 7.1%'
        },
        {
            id: 3,
            date: '2023-10-22',
            doctor: 'Dr. James Wilson',
            specialty: 'General Surgery',
            diagnosis: 'Gallbladder stones',
            treatment: 'Laparoscopic cholecystectomy',
            status: 'Resolved',
            notes: 'Successful surgery, full recovery in 2 weeks'
        },
        {
            id: 4,
            date: '2023-08-14',
            doctor: 'Dr. Lisa Park',
            specialty: 'Dermatology',
            diagnosis: 'Mild eczema',
            treatment: 'Topical hydrocortisone cream',
            status: 'Resolved',
            notes: 'Condition cleared with treatment'
        }
    ]

    const labResults = [
        {
            id: 1,
            date: '2024-01-10',
            testName: 'Complete Blood Count (CBC)',
            results: {
                'Hemoglobin': '13.2 g/dL',
                'White Blood Cells': '7,200/μL',
                'Platelets': '285,000/μL',
                'Hematocrit': '39.8%'
            },
            status: 'Normal',
            lab: 'Quest Diagnostics'
        },
        {
            id: 2,
            date: '2024-01-10',
            testName: 'Lipid Panel',
            results: {
                'Total Cholesterol': '185 mg/dL',
                'LDL': '110 mg/dL',
                'HDL': '55 mg/dL',
                'Triglycerides': '120 mg/dL'
            },
            status: 'Normal',
            lab: 'Quest Diagnostics'
        },
        {
            id: 3,
            date: '2023-12-15',
            testName: 'HbA1c',
            results: {
                'HbA1c': '7.1%'
            },
            status: 'Good Control',
            lab: 'LabCorp'
        },
        {
            id: 4,
            date: '2023-11-20',
            testName: 'Thyroid Function Test',
            results: {
                'TSH': '2.1 mIU/L',
                'Free T4': '1.2 ng/dL',
                'Free T3': '3.1 pg/mL'
            },
            status: 'Normal',
            lab: 'Quest Diagnostics'
        }
    ]

    const prescriptions = [
        {
            id: 1,
            medication: 'Metformin',
            dosage: '500mg',
            frequency: 'Twice daily with meals',
            prescribedBy: 'Dr. Emily Rodriguez',
            prescribedDate: '2023-12-03',
            refills: 3,
            status: 'Active',
            pharmacy: 'CVS Pharmacy - Main St'
        },
        {
            id: 2,
            medication: 'Lisinopril',
            dosage: '10mg',
            frequency: 'Once daily',
            prescribedBy: 'Dr. Michael Chen',
            prescribedDate: '2024-01-15',
            refills: 2,
            status: 'Active',
            pharmacy: 'Walgreens - Oak Ave'
        },
        {
            id: 3,
            medication: 'Atorvastatin',
            dosage: '20mg',
            frequency: 'Once daily at bedtime',
            prescribedBy: 'Dr. Michael Chen',
            prescribedDate: '2024-01-15',
            refills: 2,
            status: 'Active',
            pharmacy: 'Walgreens - Oak Ave'
        },
        {
            id: 4,
            medication: 'Hydrocortisone Cream',
            dosage: '1%',
            frequency: 'Apply to affected area twice daily',
            prescribedBy: 'Dr. Lisa Park',
            prescribedDate: '2023-08-14',
            refills: 0,
            status: 'Completed',
            pharmacy: 'CVS Pharmacy - Main St'
        }
    ]

    const vaccinations = [
        {
            id: 1,
            vaccine: 'COVID-19 (Pfizer)',
            date: '2023-11-15',
            nextDue: '2024-11-15',
            status: 'Up to date',
            administeredBy: 'Dr. Sarah Johnson'
        },
        {
            id: 2,
            vaccine: 'Flu Shot',
            date: '2023-10-01',
            nextDue: '2024-10-01',
            status: 'Up to date',
            administeredBy: 'CVS Pharmacy'
        },
        {
            id: 3,
            vaccine: 'Tetanus, Diphtheria, Pertussis (Tdap)',
            date: '2022-05-20',
            nextDue: '2027-05-20',
            status: 'Up to date',
            administeredBy: 'Dr. James Wilson'
        },
        {
            id: 4,
            vaccine: 'Hepatitis B',
            date: '2021-03-10',
            nextDue: 'Lifetime',
            status: 'Complete',
            administeredBy: 'City Health Department'
        }
    ]

    const upcomingAppointments = [
        {
            id: 1,
            date: '2024-02-15',
            time: '10:00 AM',
            doctor: 'Dr. Emily Rodriguez',
            specialty: 'Endocrinology',
            type: 'Follow-up',
            location: 'Medical Center - Suite 200'
        },
        {
            id: 2,
            date: '2024-02-28',
            time: '2:30 PM',
            doctor: 'Dr. Michael Chen',
            specialty: 'Cardiology',
            type: 'Annual Checkup',
            location: 'Heart Institute - Floor 3'
        }
    ]

    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <NavLink to="/" className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-zinc-200 grid place-items-center hover:bg-zinc-50 text-sm sm:text-base">←</NavLink>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">Health Records</h1>
            <p className="text-xs sm:text-sm text-zinc-600">Manage your medical information securely</p>
          </div>
        </div>
  
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          <button onClick={() => setTab('profile')} className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl border whitespace-nowrap text-sm sm:text-base ${tab==='profile' ? 'bg-white border-zinc-300 shadow-sm' : 'border-zinc-200 hover:bg-zinc-50'}`}>
            <span className="mr-1 sm:mr-2">👤</span>Profile
          </button>
          <button onClick={() => setTab('history')} className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl border whitespace-nowrap text-sm sm:text-base ${tab==='history' ? 'bg-white border-zinc-300 shadow-sm' : 'border-zinc-200 hover:bg-zinc-50'}`}>
            <span className="mr-1 sm:mr-2">🩺</span>Medical History
          </button>
          <button onClick={() => setTab('lab')} className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl border whitespace-nowrap text-sm sm:text-base ${tab==='lab' ? 'bg-white border-zinc-300 shadow-sm' : 'border-zinc-200 hover:bg-zinc-50'}`}>
            <span className="mr-1 sm:mr-2">🧪</span>Lab Results
          </button>
          <button onClick={() => setTab('prescriptions')} className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl border whitespace-nowrap text-sm sm:text-base ${tab==='prescriptions' ? 'bg-white border-zinc-300 shadow-sm' : 'border-zinc-200 hover:bg-zinc-50'}`}>
            <span className="mr-1 sm:mr-2">💊</span>Prescriptions
          </button>
          <button onClick={() => setTab('vaccines')} className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl border whitespace-nowrap text-sm sm:text-base ${tab==='vaccines' ? 'bg-white border-zinc-300 shadow-sm' : 'border-zinc-200 hover:bg-zinc-50'}`}>
            <span className="mr-1 sm:mr-2">💉</span>Vaccinations
          </button>
          <button onClick={() => setTab('appointments')} className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl border whitespace-nowrap text-sm sm:text-base ${tab==='appointments' ? 'bg-white border-zinc-300 shadow-sm' : 'border-zinc-200 hover:bg-zinc-50'}`}>
            <span className="mr-1 sm:mr-2">📅</span>Appointments
          </button>
        </div>
  
        {/* Profile Tab */}
        {tab === 'profile' && (
          <div className="rounded-xl sm:rounded-2xl bg-white border border-zinc-200 shadow-sm">
            <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-zinc-200 flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-100 text-purple-600 grid place-items-center text-sm sm:text-base">👤</div>
                <div className="font-semibold text-sm sm:text-base">Patient Profile</div>
              </div>
              <button 
                onClick={() => setEditingProfile(!editingProfile)}
                className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-zinc-300 hover:bg-zinc-50 text-xs sm:text-sm"
              >
                {editingProfile ? 'Save' : 'Edit Profile'}
              </button>
            </div>
            <div className="p-4 sm:p-5 space-y-4 sm:space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                    disabled={!editingProfile}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base disabled:bg-zinc-50" 
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1">Age</label>
                  <input 
                    type="number" 
                    value={profileData.age}
                    onChange={(e) => setProfileData({...profileData, age: e.target.value})}
                    disabled={!editingProfile}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base disabled:bg-zinc-50" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    disabled={!editingProfile}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base disabled:bg-zinc-50" 
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1">Gender</label>
                  <select 
                    value={profileData.gender}
                    onChange={(e) => setProfileData({...profileData, gender: e.target.value})}
                    disabled={!editingProfile}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base disabled:bg-zinc-50"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1">Blood Type</label>
                  <input 
                    type="text" 
                    value={profileData.bloodType}
                    onChange={(e) => setProfileData({...profileData, bloodType: e.target.value})}
                    disabled={!editingProfile}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base disabled:bg-zinc-50" 
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1">Height</label>
                  <input 
                    type="text" 
                    value={profileData.height}
                    onChange={(e) => setProfileData({...profileData, height: e.target.value})}
                    disabled={!editingProfile}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base disabled:bg-zinc-50" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1">Emergency Contact</label>
                <input 
                  type="tel" 
                  value={profileData.emergencyContact}
                  onChange={(e) => setProfileData({...profileData, emergencyContact: e.target.value})}
                  disabled={!editingProfile}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base disabled:bg-zinc-50" 
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1">Insurance Provider</label>
                  <input 
                    type="text" 
                    value={profileData.insuranceProvider}
                    onChange={(e) => setProfileData({...profileData, insuranceProvider: e.target.value})}
                    disabled={!editingProfile}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base disabled:bg-zinc-50" 
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1">Policy Number</label>
                  <input 
                    type="text" 
                    value={profileData.policyNumber}
                    onChange={(e) => setProfileData({...profileData, policyNumber: e.target.value})}
                    disabled={!editingProfile}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base disabled:bg-zinc-50" 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Medical History Tab */}
        {tab === 'history' && (
          <div className="space-y-4">
            {medicalHistory.map((record) => (
              <div key={record.id} className="rounded-xl sm:rounded-2xl bg-white border border-zinc-200 shadow-sm p-4 sm:p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">{record.diagnosis}</h3>
                    <p className="text-xs sm:text-sm text-zinc-600">{record.doctor} • {record.specialty}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    record.status === 'Ongoing' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {record.status}
                  </span>
                </div>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div><span className="font-medium">Date:</span> {record.date}</div>
                  <div><span className="font-medium">Treatment:</span> {record.treatment}</div>
                  <div><span className="font-medium">Notes:</span> {record.notes}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lab Results Tab */}
        {tab === 'lab' && (
          <div className="space-y-4">
            {labResults.map((lab) => (
              <div key={lab.id} className="rounded-xl sm:rounded-2xl bg-white border border-zinc-200 shadow-sm p-4 sm:p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">{lab.testName}</h3>
                    <p className="text-xs sm:text-sm text-zinc-600">{lab.lab} • {lab.date}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    lab.status === 'Normal' ? 'bg-green-100 text-green-700' : 
                    lab.status === 'Good Control' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {lab.status}
                  </span>
                </div>
                <div className="space-y-2">
                  {Object.entries(lab.results).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-xs sm:text-sm">
                      <span className="font-medium">{key}:</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Prescriptions Tab */}
        {tab === 'prescriptions' && (
          <div className="space-y-4">
            {prescriptions.map((prescription) => (
              <div key={prescription.id} className="rounded-xl sm:rounded-2xl bg-white border border-zinc-200 shadow-sm p-4 sm:p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">{prescription.medication}</h3>
                    <p className="text-xs sm:text-sm text-zinc-600">{prescription.dosage} • {prescription.frequency}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    prescription.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {prescription.status}
                  </span>
                </div>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div><span className="font-medium">Prescribed by:</span> {prescription.prescribedBy}</div>
                  <div><span className="font-medium">Date:</span> {prescription.prescribedDate}</div>
                  <div><span className="font-medium">Pharmacy:</span> {prescription.pharmacy}</div>
                  <div><span className="font-medium">Refills remaining:</span> {prescription.refills}</div>
                </div>
                {prescription.status === 'Active' && (
                  <button className="mt-3 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600">
                    Request Refill
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Vaccinations Tab */}
        {tab === 'vaccines' && (
          <div className="space-y-4">
            {vaccinations.map((vaccine) => (
              <div key={vaccine.id} className="rounded-xl sm:rounded-2xl bg-white border border-zinc-200 shadow-sm p-4 sm:p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">{vaccine.vaccine}</h3>
                    <p className="text-xs sm:text-sm text-zinc-600">Administered by {vaccine.administeredBy}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    vaccine.status === 'Up to date' ? 'bg-green-100 text-green-700' : 
                    vaccine.status === 'Complete' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {vaccine.status}
                  </span>
                </div>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div><span className="font-medium">Date administered:</span> {vaccine.date}</div>
                  <div><span className="font-medium">Next due:</span> {vaccine.nextDue}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Appointments Tab */}
        {tab === 'appointments' && (
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="rounded-xl sm:rounded-2xl bg-white border border-zinc-200 shadow-sm p-4 sm:p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">{appointment.type}</h3>
                    <p className="text-xs sm:text-sm text-zinc-600">{appointment.doctor} • {appointment.specialty}</p>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                    Upcoming
                  </span>
                </div>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div><span className="font-medium">Date:</span> {appointment.date}</div>
                  <div><span className="font-medium">Time:</span> {appointment.time}</div>
                  <div><span className="font-medium">Location:</span> {appointment.location}</div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600">
                    Reschedule
                  </button>
                  <button className="px-3 py-1.5 border border-zinc-300 text-zinc-700 rounded-lg text-xs hover:bg-zinc-50">
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
  

export default HealthRecords