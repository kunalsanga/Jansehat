import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Skeleton from './Skeleton'

function EmergencyMode() {
    const { t } = useTranslation()
    const [emergencyType, setEmergencyType] = useState('')
    const [location, setLocation] = useState('')
    const [isCalling, setIsCalling] = useState(false)
    const [isHospitalsLoading, setIsHospitalsLoading] = useState(true)

    useEffect(()=>{
      const id = setTimeout(()=> setIsHospitalsLoading(false), 400)
      return ()=> clearTimeout(id)
    }, [])

    const emergencyServices = [
        {
            id: 1,
            name: t('emergency.services.ambulance.name'),
            number: '108',
            description: t('emergency.services.ambulance.desc'),
            icon: '🚑',
            color: 'bg-red-500'
        },
        {
            id: 2,
            name: t('emergency.services.police.name'),
            number: '100',
            description: t('emergency.services.police.desc'),
            icon: '👮',
            color: 'bg-blue-500'
        },
        {
            id: 3,
            name: t('emergency.services.fire.name'),
            number: '101',
            description: t('emergency.services.fire.desc'),
            icon: '🚒',
            color: 'bg-orange-500'
        },
        {
            id: 4,
            name: t('emergency.services.women.name'),
            number: '1091',
            description: t('emergency.services.women.desc'),
            icon: '👩',
            color: 'bg-pink-500'
        },
        {
            id: 5,
            name: t('emergency.services.child.name'),
            number: '1098',
            description: t('emergency.services.child.desc'),
            icon: '👶',
            color: 'bg-green-500'
        },
        {
            id: 6,
            name: t('emergency.services.mental.name'),
            number: '1800-599-0019',
            description: t('emergency.services.mental.desc'),
            icon: '🧠',
            color: 'bg-purple-500'
        }
    ]

    const nearbyHospitals = [
        {
            id: 1,
            name: t('emergency.hospitals.h1.name'),
            distance: t('emergency.hospitals.h1.distance'),
            address: t('emergency.hospitals.h1.address'),
            phone: t('emergency.hospitals.h1.phone'),
            emergency: true,
            specialties: t('emergency.hospitals.h1.specialties', { returnObjects: true })
        },
        {
            id: 2,
            name: t('emergency.hospitals.h2.name'),
            distance: t('emergency.hospitals.h2.distance'),
            address: t('emergency.hospitals.h2.address'),
            phone: t('emergency.hospitals.h2.phone'),
            emergency: true,
            specialties: t('emergency.hospitals.h2.specialties', { returnObjects: true })
        },
        {
            id: 3,
            name: t('emergency.hospitals.h3.name'),
            distance: t('emergency.hospitals.h3.distance'),
            address: t('emergency.hospitals.h3.address'),
            phone: t('emergency.hospitals.h3.phone'),
            emergency: true,
            specialties: t('emergency.hospitals.h3.specialties', { returnObjects: true })
        }
    ]

    const handleEmergencyCall = (service) => {
        setIsCalling(true)
        setTimeout(() => {
            setIsCalling(false)
            alert(t('emergency.calling', { name: service.name, number: service.number }))
        }, 2000)
    }

    const handleHospitalCall = (hospital) => {
        alert(t('emergency.callingHospital', { name: hospital.name, phone: hospital.phone }))
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <NavLink to="/" className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-zinc-200 grid place-items-center hover:bg-zinc-50 text-sm sm:text-base">←</NavLink>
                <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">{t('emergency.title')}</h1>
                    <p className="text-xs sm:text-sm text-zinc-600">{t('emergency.subtitle')}</p>
                </div>
            </div>

            {/* Emergency Alert */}
            <div className="rounded-xl sm:rounded-2xl bg-red-50 border border-red-200 p-4 sm:p-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center text-xl">🚨</div>
                    <div>
                        <h3 className="font-semibold text-red-800">{t('emergency.alertTitle')}</h3>
                        <p className="text-sm text-red-700">{t('emergency.alertText')}</p>
                    </div>
                </div>
            </div>

            {/* Emergency Services */}
            <div className="rounded-xl sm:rounded-2xl bg-white border border-zinc-200 shadow-sm">
                <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-zinc-200">
                    <h2 className="text-lg font-semibold">{t('emergency.servicesTitle')}</h2>
                    <p className="text-sm text-zinc-600">{t('emergency.servicesSubtitle')}</p>
                </div>
                <div className="p-4 sm:p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {emergencyServices.map((service) => (
                            <button
                                key={service.id}
                                onClick={() => handleEmergencyCall(service)}
                                disabled={isCalling}
                                className={`p-4 rounded-lg border-2 border-transparent hover:border-zinc-300 transition-all text-left ${isCalling ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`w-10 h-10 rounded-full ${service.color} text-white flex items-center justify-center text-lg`}>
                                        {service.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm">{service.name}</h3>
                                        <p className="text-lg font-bold text-zinc-800">{service.number}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-zinc-600">{service.description}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Nearby Hospitals */}
            <div className="rounded-xl sm:rounded-2xl bg-white border border-zinc-200 shadow-sm">
                <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-zinc-200">
                    <h2 className="text-lg font-semibold">{t('emergency.nearbyHospitalsTitle')}</h2>
                    <p className="text-sm text-zinc-600">{t('emergency.nearbyHospitalsSubtitle')}</p>
                </div>
                <div className="p-4 sm:p-5 space-y-3">
                    {isHospitalsLoading ? (
                      [...Array(3)].map((_,i)=> (
                        <div key={i} className="p-3 rounded-lg border border-zinc-200">
                          <div className="flex items-center gap-3">
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <div className="flex-1 space-y-2">
                              <Skeleton className="h-4 w-1/3" />
                              <Skeleton className="h-3 w-2/3" />
                              <Skeleton className="h-3 w-1/4" />
                            </div>
                            <Skeleton className="w-20 h-8 rounded-md" />
                          </div>
                        </div>
                      ))
                    ) : (
                      nearbyHospitals.map((hospital) => (
                        <div key={hospital.id} className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 hover:bg-zinc-50">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-sm">{hospital.name}</h3>
                                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">{t('emergency.badgeEmergency')}</span>
                                </div>
                                <p className="text-xs text-zinc-600 mb-1">{hospital.address}</p>
                                <div className="flex items-center gap-4 text-xs text-zinc-500">
                                    <span>📍 {hospital.distance}</span>
                                    <span>📞 {hospital.phone}</span>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {hospital.specialties.map((specialty, index) => (
                                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                            {specialty}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={() => handleHospitalCall(hospital)}
                                className="ml-3 px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600 transition"
                            >
                                {t('emergency.callNow')}
                            </button>
                        </div>
                      ))
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-xl sm:rounded-2xl bg-white border border-zinc-200 shadow-sm">
                <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-zinc-200">
                    <h2 className="text-lg font-semibold">{t('emergency.quickActionsTitle')}</h2>
                </div>
                <div className="p-4 sm:p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button className="p-3 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-left">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">📍</span>
                                <span className="font-medium text-sm">{t('emergency.shareLocation')}</span>
                            </div>
                            <p className="text-xs text-zinc-600">{t('emergency.shareLocationDesc')}</p>
                        </button>
                        <button className="p-3 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-left">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">📋</span>
                                <span className="font-medium text-sm">{t('emergency.medicalInfo')}</span>
                            </div>
                            <p className="text-xs text-zinc-600">{t('emergency.medicalInfoDesc')}</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmergencyMode
