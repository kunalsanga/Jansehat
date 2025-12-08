import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'

// --- TRANSLATION DATA ---
const T = {
    en: {
        header: 'Health Records',
        subtitle: 'Manage your medical information securely',
        date: 'Date',
        treatment: 'Treatment',
        notes: 'Notes',
        dosage: 'Dosage',
        frequency: 'Frequency',
        prescribedBy: 'Prescribed by',
        refillsRemaining: 'Refills remaining',
        dateAdministered: 'Date administered',
        nextDue: 'Next due',
        time: 'Time',
        location: 'Location',
        category: {
            MedicalHistory: 'Medical History',
            LabResult: 'Lab Result',
            Prescription: 'Prescription',
            Vaccination: 'Vaccination',
            Appointment: 'Appointment',
        }
    },
    hi: {
        header: 'स्वास्थ्य रिकॉर्ड',
        subtitle: 'अपनी चिकित्सा जानकारी को सुरक्षित रूप से प्रबंधित करें',
        date: 'तिथि',
        treatment: 'उपचार',
        notes: 'टिप्पणियाँ',
        dosage: 'खुराक',
        frequency: 'आवृत्ति',
        prescribedBy: 'दवा लिखने वाला',
        refillsRemaining: 'शेष रीफिल',
        dateAdministered: 'दवा देने की तिथि',
        nextDue: 'अगली देय तिथि',
        time: 'समय',
        location: 'स्थान',
        category: {
            MedicalHistory: 'चिकित्सा इतिहास',
            LabResult: 'प्रयोगशाला परिणाम',
            Prescription: 'नुस्खा',
            Vaccination: 'टीकाकरण',
            Appointment: 'नियुक्ति',
        }
    },
};
// --- END TRANSLATION DATA ---


function HealthRecords() {
    // State to force re-render if needed, though language is primary focus
    const [tab, setTab] = useState('profile') 
    const [editingProfile, setEditingProfile] = useState(false)
    
    // LANGUAGE PERSISTENCE: Load language from localStorage
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('appLanguage') || 'en'
    })

    // GETTER: Translation object (t)
    const t = T[language] || T.en

    // Comprehensive dummy data (Data content remains in English/original format as it's static)
    // NOTE: In a real app, the `diagnosis`, `doctor`, `testName`, etc., would come from a multilingual database.
    const medicalHistory = [
        {
            id: 1,
            date: '2024-01-15',
            doctor: 'Dr. Prakash Padhi',
            specialty: 'Cardiology',
            diagnosis: 'Hypertension', // STATIC DATA
            treatment: 'Prescribed Lisinopril 10mg daily', // STATIC DATA
            status: 'Ongoing',
            notes: 'Blood pressure well controlled with medication' // STATIC DATA
        },
        // ... (rest of medicalHistory data)
        {
            id: 2,
            date: '2023-12-03',
            doctor: 'Dr. Rajesh Singh',
            specialty: 'Endocrinology',
            diagnosis: 'Type 2 Diabetes',
            treatment: 'Metformin 500mg twice daily, dietary counseling',
            status: 'Ongoing',
            notes: 'HbA1c improved from 8.2% to 7.1%'
        },
        {
            id: 3,
            date: '2023-10-22',
            doctor: 'Dr. Rashmi Naik',
            specialty: 'General Surgery',
            diagnosis: 'Gallbladder stones',
            treatment: 'Laparoscopic cholecystectomy',
            status: 'Resolved',
            notes: 'Successful surgery, full recovery in 2 weeks'
        },
        {
            id: 4,
            date: '2023-08-14',
            doctor: 'Dr. Sagarika Pradhan',
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
            testName: 'Complete Blood Count (CBC)', // STATIC DATA
            results: {
                'Hemoglobin': '13.2 g/dL',
                'White Blood Cells': '7,200/μL',
                'Platelets': '285,000/μL',
                'Hematocrit': '39.8%'
            },
            status: 'Normal',
            
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
            
        },
        {
            id: 3,
            date: '2023-12-15',
            testName: 'HbA1c',
            results: {
                'HbA1c': '7.1%'
            },
            status: 'Good Control',
            
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
            
        }
    ]

    const prescriptions = [
        {
            id: 1,
            medication: 'Metformin',
            dosage: '500mg',
            frequency: 'Twice daily with meals',
            prescribedBy: 'Dr. Sooraj Raj',
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
            prescribedBy: 'Dr. Srishti Kumari',
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
            prescribedBy: 'Dr. Asmita Soni',
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
            prescribedBy: 'Dr. Sameer Behra',
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
            administeredBy: 'Dr. Saurav Mishra'
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
            administeredBy: 'Dr. Ram Singh'
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
            doctor: 'Dr. Mahesh Kumar',
            specialty: 'Endocrinology',
            type: 'Follow-up',
            location: 'Medical Center - Suite 200'
        },
        {
            id: 2,
            date: '2024-02-28',
            time: '2:30 PM',
            doctor: 'Dr. Sneha Kumari',
            specialty: 'Cardiology',
            type: 'Annual Checkup',
            location: 'Heart Institute - Floor 3'
        }
    ]

    // Combine all records for unified tab
    const allRecords = [
        // Mapping the original data with translated 'type' names for rendering
        ...medicalHistory.map(r => ({ ...r, type: t.category.MedicalHistory, originalType: 'Medical History', sortDate: new Date(r.date) })),
        ...labResults.map(r => ({ ...r, type: t.category.LabResult, originalType: 'Lab Result', sortDate: new Date(r.date) })),
        ...prescriptions.map(r => ({ ...r, type: t.category.Prescription, originalType: 'Prescription', sortDate: new Date(r.prescribedDate) })),
        ...vaccinations.map(r => ({ ...r, type: t.category.Vaccination, originalType: 'Vaccination', sortDate: new Date(r.date) })),
        ...upcomingAppointments.map(r => ({ ...r, type: t.category.Appointment, originalType: 'Appointment', sortDate: new Date(r.date) }))
    ].sort((a, b) => b.sortDate - a.sortDate); // latest first

    return (
        <div className="min-h-screen overflow-y-auto p-4 space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <NavLink to="/" className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-zinc-200 grid place-items-center hover:bg-zinc-50 text-sm sm:text-base">←</NavLink>
                <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">{t.header}</h1>
                    <p className="text-xs sm:text-sm text-zinc-600">{t.subtitle}</p>
                </div>
            </div>
        
            {/* Unified Scrollable Records */}
            <div className="space-y-4 sm:space-y-6">
                {allRecords.map(record => {
                    // Use originalType for color logic, but use translated 'type' for display
                    let bgColor = '';
                    switch(record.originalType) {
                        case 'Medical History':
                            bgColor = 'bg-yellow-50 border-yellow-300';
                            break;
                        case 'Lab Result':
                            bgColor = 'bg-blue-50 border-blue-300';
                            break;
                        case 'Prescription':
                            bgColor = 'bg-green-50 border-green-300';
                            break;
                        case 'Vaccination':
                            bgColor = 'bg-purple-50 border-purple-300';
                            break;
                        case 'Appointment':
                            bgColor = 'bg-pink-50 border-pink-300';
                            break;
                        default:
                            bgColor = 'bg-white border-zinc-200';
                    }
            
                    return (
                        <div key={`${record.originalType}-${record.id}`} className={`rounded-xl sm:rounded-2xl ${bgColor} border shadow-sm p-4 sm:p-5`}>
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="font-semibold text-sm sm:text-base">{record.type}: {record.diagnosis || record.testName || record.medication || record.vaccine || record.type}</h3>
                                    <p className="text-xs sm:text-sm text-zinc-600">
                                        {record.doctor || record.lab || record.administeredBy || record.prescribedBy || ''}
                                        {record.specialty ? ` • ${record.specialty}` : ''}
                                    </p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs text-white ${
                                    record.originalType === 'Medical History' ? 'bg-yellow-500' :
                                    record.originalType === 'Lab Result' ? 'bg-blue-500' :
                                    record.originalType === 'Prescription' ? 'bg-green-500' :
                                    record.originalType === 'Vaccination' ? 'bg-purple-500' :
                                    record.originalType === 'Appointment' ? 'bg-pink-500' : 'bg-gray-500'
                                }`}>
                                    {record.type}
                                </span>
                            </div>

                            {/* Record Details */}
                            <div className="space-y-1 text-xs sm:text-sm">
                                {record.originalType === 'Medical History' && (
                                    <>
                                        <div><span className="font-medium">{t.date}:</span> {record.date}</div>
                                        <div><span className="font-medium">{t.treatment}:</span> {record.treatment}</div>
                                        <div><span className="font-medium">{t.notes}:</span> {record.notes}</div>
                                    </>
                                )}
                                {record.originalType === 'Lab Result' && (
                                    <>
                                        <div><span className="font-medium">{t.date}:</span> {record.date}</div>
                                        {Object.entries(record.results).map(([key, value]) => (
                                            <div key={key} className="flex justify-between">
                                                <span className="font-medium">{key}:</span>
                                                <span>{value}</span>
                                            </div>
                                        ))}
                                    </>
                                )}
                                {record.originalType === 'Prescription' && (
                                    <>
                                        <div><span className="font-medium">{t.dosage}:</span> {record.dosage}</div>
                                        <div><span className="font-medium">{t.frequency}:</span> {record.frequency}</div>
                                        <div><span className="font-medium">{t.prescribedBy}:</span> {record.prescribedBy}</div>
                                        <div><span className="font-medium">{t.refillsRemaining}:</span> {record.refills}</div>
                                    </>
                                )}
                                {record.originalType === 'Vaccination' && (
                                    <>
                                        <div><span className="font-medium">{t.dateAdministered}:</span> {record.date}</div>
                                        <div><span className="font-medium">{t.nextDue}:</span> {record.nextDue}</div>
                                    </>
                                )}
                                {record.originalType === 'Appointment' && (
                                    <>
                                        <div><span className="font-medium">{t.date}:</span> {record.date}</div>
                                        <div><span className="font-medium">{t.time}:</span> {record.time}</div>
                                        <div><span className="font-medium">{t.location}:</span> {record.location}</div>
                                    </>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        
        </div>
    )

    
    }
    

export default HealthRecords