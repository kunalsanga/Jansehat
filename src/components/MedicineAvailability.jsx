import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Skeleton from './Skeleton'

function MedicineAvailability() {
    const { t } = useTranslation()
    const [query, setQuery] = useState('')
    const [category, setCategory] = useState('All Medicines')
    const [sortBy, setSortBy] = useState('name')
    const [showPrescriptionOnly, setShowPrescriptionOnly] = useState(false)
    const [cart, setCart] = useState([])
    const [showCart, setShowCart] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
  
    useEffect(() => {
      const id = setTimeout(()=> setIsLoading(false), 400)
      return () => clearTimeout(id)
    }, [])
  
    const categories = [
      'All Medicines',
      'Pain Relief',
      'Fever',
      'Cold & Flu',
      'Digestive',
      'Cardiac',
      'Diabetic',
      'Antibiotic',
      'Vitamins',
      'Skin Care',
      'Respiratory',
      'Neurological',
      'Hormonal',
      'Other',
    ]
  
    const medicines = [
      // Pain Relief
      {
        id: 1,
        name: 'Ibuprofen',
        brand: 'Advil',
        tags: ['Pain Relief', 'Anti-inflammatory'],
        stock: 'In Stock',
        price: 45,
        pharmacy: 'CVS Pharmacy - Main St',
        dosage: '400mg - 3 times daily with food',
        expires: '12/15/2025',
        category: 'Pain Relief',
        prescriptionRequired: false,
        sideEffects: 'May cause stomach upset, dizziness',
        interactions: 'Avoid with blood thinners',
        description: 'Non-steroidal anti-inflammatory drug for pain and inflammation'
      },
      {
        id: 2,
        name: 'Acetaminophen',
        brand: 'Tylenol',
        tags: ['Pain Relief', 'Fever'],
        stock: 'In Stock',
        price: 35,
        pharmacy: 'Walgreens - Oak Ave',
        dosage: '500mg - every 6 hours',
        expires: '8/20/2026',
        category: 'Pain Relief',
        prescriptionRequired: false,
        sideEffects: 'Rare liver damage with overdose',
        interactions: 'Avoid with alcohol',
        description: 'Pain reliever and fever reducer'
      },
      {
        id: 3,
        name: 'Tramadol',
        brand: 'Ultram',
        tags: ['Pain Relief', 'Opioid'],
        stock: 'Limited',
        price: 120,
        pharmacy: 'Apollo Pharmacy - Central Plaza',
        dosage: '50mg - twice daily',
        expires: '5/10/2025',
        category: 'Pain Relief',
        prescriptionRequired: true,
        sideEffects: 'Drowsiness, nausea, constipation',
        interactions: 'Avoid with alcohol and sedatives',
        description: 'Opioid pain medication for moderate to severe pain'
      },
      
      // Fever
      {
        id: 4,
        name: 'Paracetamol 650',
        brand: 'Dolo',
        tags: ['Fever', 'Pain Relief'],
        stock: 'In Stock',
        price: 40,
        pharmacy: 'City Care Pharmacy - Market Road',
        dosage: '650mg - after meals',
        expires: '3/15/2026',
        category: 'Fever',
        prescriptionRequired: false,
        sideEffects: 'Rare allergic reactions',
        interactions: 'Avoid with warfarin',
        description: 'Effective fever reducer and pain reliever'
      },
      {
        id: 5,
        name: 'Aspirin',
        brand: 'Bayer',
        tags: ['Fever', 'Pain Relief', 'Cardiac'],
        stock: 'In Stock',
        price: 25,
        pharmacy: 'Rite Aid - Broadway',
        dosage: '325mg - every 4-6 hours',
        expires: '10/30/2025',
        category: 'Fever',
        prescriptionRequired: false,
        sideEffects: 'Stomach irritation, bleeding risk',
        interactions: 'Avoid with blood thinners',
        description: 'Anti-inflammatory and fever reducer'
      },

      // Cold & Flu
      {
        id: 6,
        name: 'Cough Syrup',
        brand: 'Benadryl',
        tags: ['Cold & Flu', 'Cough'],
        stock: 'Low Stock',
        price: 75,
        pharmacy: 'Family Pharmacy - Residential Area',
        dosage: '10ml - 2 times daily',
        expires: '7/10/2025',
        category: 'Cold & Flu',
        prescriptionRequired: false,
        sideEffects: 'Drowsiness, dry mouth',
        interactions: 'Avoid with alcohol',
        description: 'Cough suppressant and antihistamine'
      },
      {
        id: 7,
        name: 'Pseudoephedrine',
        brand: 'Sudafed',
        tags: ['Cold & Flu', 'Decongestant'],
        stock: 'In Stock',
        price: 55,
        pharmacy: 'CVS Pharmacy - Main St',
        dosage: '60mg - every 6 hours',
        expires: '9/25/2025',
        category: 'Cold & Flu',
        prescriptionRequired: false,
        sideEffects: 'Insomnia, nervousness',
        interactions: 'Avoid with MAO inhibitors',
        description: 'Nasal decongestant for cold symptoms'
      },
      {
        id: 8,
        name: 'Oseltamivir',
        brand: 'Tamiflu',
        tags: ['Cold & Flu', 'Antiviral'],
        stock: 'In Stock',
        price: 180,
        pharmacy: 'Apollo Pharmacy - Central Plaza',
        dosage: '75mg - twice daily for 5 days',
        expires: '6/15/2025',
        category: 'Cold & Flu',
        prescriptionRequired: true,
        sideEffects: 'Nausea, vomiting, headache',
        interactions: 'Take with food',
        description: 'Antiviral medication for influenza treatment'
      },

      // Digestive
      {
        id: 9,
        name: 'Omeprazole',
        brand: 'Omez',
        tags: ['Digestive', 'Proton Pump Inhibitor'],
        stock: 'Limited',
        price: 120,
        pharmacy: 'Wellness Chemist - Main Street',
        dosage: '20mg - once daily before breakfast',
        expires: '11/30/2025',
        category: 'Digestive',
        prescriptionRequired: false,
        sideEffects: 'Headache, diarrhea, nausea',
        interactions: 'Avoid with clopidogrel',
        description: 'Proton pump inhibitor for acid reflux and ulcers'
      },
      {
        id: 10,
        name: 'Ranitidine',
        brand: 'Zantac',
        tags: ['Digestive', 'H2 Blocker'],
        stock: 'Out of Stock',
        price: 65,
        pharmacy: 'Walgreens - Oak Ave',
        dosage: '150mg - twice daily',
        expires: '4/20/2025',
        category: 'Digestive',
        prescriptionRequired: false,
        sideEffects: 'Headache, constipation',
        interactions: 'May affect other medications',
        description: 'H2 receptor antagonist for acid reduction'
      },
      {
        id: 11,
        name: 'Loperamide',
        brand: 'Imodium',
        tags: ['Digestive', 'Anti-diarrheal'],
        stock: 'In Stock',
        price: 30,
        pharmacy: 'CVS Pharmacy - Main St',
        dosage: '2mg - after each loose stool',
        expires: '2/28/2026',
        category: 'Digestive',
        prescriptionRequired: false,
        sideEffects: 'Constipation, dizziness',
        interactions: 'Avoid with opioids',
        description: 'Anti-diarrheal medication'
      },

      // Cardiac
      {
        id: 12,
        name: 'Atorvastatin',
        brand: 'Lipitor',
        tags: ['Cardiac', 'Statin'],
        stock: 'In Stock',
        price: 95,
        pharmacy: 'Apollo Pharmacy - Central Plaza',
        dosage: '20mg - once daily at bedtime',
        expires: '8/15/2025',
        category: 'Cardiac',
        prescriptionRequired: true,
        sideEffects: 'Muscle pain, liver enzyme elevation',
        interactions: 'Avoid with grapefruit juice',
        description: 'Statin medication for cholesterol management'
      },
      {
        id: 13,
        name: 'Metoprolol',
        brand: 'Lopressor',
        tags: ['Cardiac', 'Beta Blocker'],
        stock: 'In Stock',
        price: 75,
        pharmacy: 'Walgreens - Oak Ave',
        dosage: '50mg - twice daily',
        expires: '7/30/2025',
        category: 'Cardiac',
        prescriptionRequired: true,
        sideEffects: 'Fatigue, dizziness, cold hands',
        interactions: 'Avoid with verapamil',
        description: 'Beta blocker for blood pressure and heart rate control'
      },
      {
        id: 14,
        name: 'Lisinopril',
        brand: 'Prinivil',
        tags: ['Cardiac', 'ACE Inhibitor'],
        stock: 'In Stock',
        price: 45,
        pharmacy: 'CVS Pharmacy - Main St',
        dosage: '10mg - once daily',
        expires: '12/10/2025',
        category: 'Cardiac',
        prescriptionRequired: true,
        sideEffects: 'Dry cough, dizziness, hyperkalemia',
        interactions: 'Avoid with potassium supplements',
        description: 'ACE inhibitor for blood pressure management'
      },

      // Diabetic
      {
        id: 15,
        name: 'Metformin',
        brand: 'Glucophage',
        tags: ['Diabetic', 'Biguanide'],
        stock: 'In Stock',
        price: 35,
        pharmacy: 'City Care Pharmacy - Market Road',
        dosage: '500mg - twice daily with meals',
        expires: '9/20/2025',
        category: 'Diabetic',
        prescriptionRequired: true,
        sideEffects: 'Nausea, diarrhea, metallic taste',
        interactions: 'Avoid with contrast agents',
        description: 'First-line medication for type 2 diabetes'
      },
      {
        id: 16,
        name: 'Insulin Glargine',
        brand: 'Lantus',
        tags: ['Diabetic', 'Insulin'],
        stock: 'In Stock',
        price: 280,
        pharmacy: 'Apollo Pharmacy - Central Plaza',
        dosage: '20 units - once daily at bedtime',
        expires: '6/30/2025',
        category: 'Diabetic',
        prescriptionRequired: true,
        sideEffects: 'Hypoglycemia, injection site reactions',
        interactions: 'Monitor with other diabetes medications',
        description: 'Long-acting insulin for diabetes management'
      },
      {
        id: 17,
        name: 'Glipizide',
        brand: 'Glucotrol',
        tags: ['Diabetic', 'Sulfonylurea'],
        stock: 'Limited',
        price: 55,
        pharmacy: 'Walgreens - Oak Ave',
        dosage: '5mg - 30 minutes before breakfast',
        expires: '5/15/2025',
        category: 'Diabetic',
        prescriptionRequired: true,
        sideEffects: 'Hypoglycemia, weight gain',
        interactions: 'Avoid with alcohol',
        description: 'Sulfonylurea for type 2 diabetes'
      },

      // Antibiotic
      {
        id: 18,
        name: 'Amoxicillin',
        brand: 'Novamox',
        tags: ['Antibiotic', 'Penicillin'],
        stock: 'In Stock',
        price: 85,
        pharmacy: 'Apollo Pharmacy - Central Plaza',
        dosage: '500mg - 1 capsule 3 times daily',
        expires: '6/30/2025',
        category: 'Antibiotic',
        prescriptionRequired: true,
        sideEffects: 'Diarrhea, nausea, rash',
        interactions: 'Avoid with methotrexate',
        description: 'Broad-spectrum penicillin antibiotic'
      },
      {
        id: 19,
        name: 'Ciprofloxacin',
        brand: 'Cipro',
        tags: ['Antibiotic', 'Fluoroquinolone'],
        stock: 'In Stock',
        price: 95,
        pharmacy: 'CVS Pharmacy - Main St',
        dosage: '500mg - twice daily',
        expires: '8/25/2025',
        category: 'Antibiotic',
        prescriptionRequired: true,
        sideEffects: 'Nausea, diarrhea, tendon rupture risk',
        interactions: 'Avoid with antacids',
        description: 'Fluoroquinolone antibiotic for various infections'
      },
      {
        id: 20,
        name: 'Azithromycin',
        brand: 'Zithromax',
        tags: ['Antibiotic', 'Macrolide'],
        stock: 'Limited',
        price: 75,
        pharmacy: 'Walgreens - Oak Ave',
        dosage: '500mg - once daily for 3 days',
        expires: '7/10/2025',
        category: 'Antibiotic',
        prescriptionRequired: true,
        sideEffects: 'Nausea, diarrhea, QT prolongation',
        interactions: 'Avoid with warfarin',
        description: 'Macrolide antibiotic for respiratory infections'
      },

      // Vitamins
      {
        id: 21,
        name: 'Vitamin D3',
        brand: 'Nature Made',
        tags: ['Vitamins', 'Bone Health'],
        stock: 'In Stock',
        price: 25,
        pharmacy: 'CVS Pharmacy - Main St',
        dosage: '1000 IU - once daily',
        expires: '12/31/2026',
        category: 'Vitamins',
        prescriptionRequired: false,
        sideEffects: 'Rare hypercalcemia',
        interactions: 'Take with calcium for better absorption',
        description: 'Essential vitamin for bone health and immune function'
      },
      {
        id: 22,
        name: 'Multivitamin',
        brand: 'Centrum',
        tags: ['Vitamins', 'General Health'],
        stock: 'In Stock',
        price: 35,
        pharmacy: 'Walgreens - Oak Ave',
        dosage: '1 tablet - once daily with food',
        expires: '10/15/2026',
        category: 'Vitamins',
        prescriptionRequired: false,
        sideEffects: 'Nausea if taken on empty stomach',
        interactions: 'May interfere with some medications',
        description: 'Complete multivitamin for daily nutrition'
      },
      {
        id: 23,
        name: 'Vitamin B12',
        brand: "Nature's Bounty",
        tags: ['Vitamins', 'Energy'],
        stock: 'In Stock',
        price: 20,
        pharmacy: 'Rite Aid - Broadway',
        dosage: '1000mcg - once daily',
        expires: '11/30/2026',
        category: 'Vitamins',
        prescriptionRequired: false,
        sideEffects: 'Rare allergic reactions',
        interactions: 'May interfere with metformin',
        description: 'Essential B vitamin for nerve function and energy'
      },

      // Skin Care
      {
        id: 24,
        name: 'Hydrocortisone Cream',
        brand: 'Cortizone-10',
        tags: ['Skin Care', 'Topical Steroid'],
        stock: 'In Stock',
        price: 15,
        pharmacy: 'CVS Pharmacy - Main St',
        dosage: 'Apply thin layer 2-3 times daily',
        expires: '9/20/2026',
        category: 'Skin Care',
        prescriptionRequired: false,
        sideEffects: 'Skin thinning with prolonged use',
        interactions: 'Avoid with other topical medications',
        description: 'Topical corticosteroid for skin inflammation'
      },
      {
        id: 25,
        name: 'Clotrimazole Cream',
        brand: 'Lotrimin',
        tags: ['Skin Care', 'Antifungal'],
        stock: 'In Stock',
        price: 18,
        pharmacy: 'Walgreens - Oak Ave',
        dosage: 'Apply to affected area twice daily',
        expires: '8/15/2026',
        category: 'Skin Care',
        prescriptionRequired: false,
        sideEffects: 'Mild burning, irritation',
        interactions: 'Avoid with other topical antifungals',
        description: 'Antifungal cream for skin infections'
      },

      // Respiratory
      {
        id: 26,
        name: 'Albuterol Inhaler',
        brand: 'Proventil',
        tags: ['Respiratory', 'Bronchodilator'],
        stock: 'In Stock',
        price: 45,
        pharmacy: 'Apollo Pharmacy - Central Plaza',
        dosage: '2 puffs every 4-6 hours as needed',
        expires: '4/30/2025',
        category: 'Respiratory',
        prescriptionRequired: true,
        sideEffects: 'Tremor, nervousness, rapid heartbeat',
        interactions: 'Avoid with beta blockers',
        description: 'Bronchodilator for asthma and COPD'
      },
      {
        id: 27,
        name: 'Fluticasone Nasal Spray',
        brand: 'Flonase',
        tags: ['Respiratory', 'Nasal Steroid'],
        stock: 'In Stock',
        price: 35,
        pharmacy: 'CVS Pharmacy - Main St',
        dosage: '2 sprays in each nostril once daily',
        expires: '7/25/2025',
        category: 'Respiratory',
        prescriptionRequired: false,
        sideEffects: 'Nasal irritation, nosebleeds',
        interactions: 'May increase risk of infections',
        description: 'Nasal corticosteroid for allergies'
      },

      // Neurological
      {
        id: 28,
        name: 'Gabapentin',
        brand: 'Neurontin',
        tags: ['Neurological', 'Anticonvulsant'],
        stock: 'In Stock',
        price: 85,
        pharmacy: 'Walgreens - Oak Ave',
        dosage: '300mg - three times daily',
        expires: '6/20/2025',
        category: 'Neurological',
        prescriptionRequired: true,
        sideEffects: 'Drowsiness, dizziness, weight gain',
        interactions: 'Avoid with alcohol',
        description: 'Anticonvulsant for nerve pain and seizures'
      },
      {
        id: 29,
        name: 'Duloxetine',
        brand: 'Cymbalta',
        tags: ['Neurological', 'Antidepressant'],
        stock: 'Limited',
        price: 150,
        pharmacy: 'Apollo Pharmacy - Central Plaza',
        dosage: '60mg - once daily',
        expires: '5/10/2025',
        category: 'Neurological',
        prescriptionRequired: true,
        sideEffects: 'Nausea, dry mouth, insomnia',
        interactions: 'Avoid with MAO inhibitors',
        description: 'SNRI for depression and nerve pain'
      },

      // Hormonal
      {
        id: 30,
        name: 'Levothyroxine',
        brand: 'Synthroid',
        tags: ['Hormonal', 'Thyroid'],
        stock: 'In Stock',
        price: 25,
        pharmacy: 'CVS Pharmacy - Main St',
        dosage: '50mcg - once daily on empty stomach',
        expires: '9/15/2025',
        category: 'Hormonal',
        prescriptionRequired: true,
        sideEffects: 'Palpitations, weight loss, insomnia',
        interactions: 'Avoid with calcium and iron',
        description: 'Thyroid hormone replacement therapy'
      }
    ]
  
    const filtered = medicines.filter((m) => {
      const matchesQuery = [m.name, m.brand, m.pharmacy, m.description].join(' ').toLowerCase().includes(query.toLowerCase())
      const matchesCat = category === 'All Medicines' || m.category === category
      const matchesPrescription = !showPrescriptionOnly || m.prescriptionRequired
      return matchesQuery && matchesCat && matchesPrescription
    }).sort((a, b) => {
      switch(sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'price':
          return a.price - b.price
        case 'stock':
          const stockOrder = { 'In Stock': 0, 'Limited': 1, 'Low Stock': 2, 'Out of Stock': 3 }
          return stockOrder[a.stock] - stockOrder[b.stock]
        case 'expiry':
          return new Date(a.expires) - new Date(b.expires)
        default:
          return 0
      }
    })

    const addToCart = (medicine) => {
      const existingItem = cart.find(item => item.id === medicine.id)
      if (existingItem) {
        setCart(cart.map(item => 
          item.id === medicine.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ))
      } else {
        setCart([...cart, { ...medicine, quantity: 1 }])
      }
    }

    const removeFromCart = (medicineId) => {
      setCart(cart.filter(item => item.id !== medicineId))
    }

    const updateQuantity = (medicineId, quantity) => {
      if (quantity <= 0) {
        removeFromCart(medicineId)
      } else {
        setCart(cart.map(item => 
          item.id === medicineId 
            ? { ...item, quantity }
            : item
        ))
      }
    }

    const getTotalPrice = () => {
      return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
    }
  
    function StockBadge({ stock }) {
      const style = stock === 'In Stock'
        ? 'bg-green-100 text-green-700'
        : stock === 'Low Stock' || stock === 'Limited'
        ? 'bg-yellow-100 text-yellow-700'
        : 'bg-zinc-100 text-zinc-700'
      return <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${style}`}><span className="text-[10px]">⏺</span>{stock}</span>
    }
  
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Header with Cart */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">{t('medicine.title')}</h1>
            <p className="text-xs sm:text-sm text-zinc-600">{t('medicine.subtitle')}</p>
          </div>
          <button 
            onClick={() => setShowCart(!showCart)}
            className="relative px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm sm:text-base"
          >
            🛒 {t('medicine.cart')} ({cart.length})
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1">
              <div className="rounded-xl sm:rounded-2xl border border-amber-100 bg-amber-50/60 p-2">
                <div className="flex items-center gap-2 rounded-lg sm:rounded-xl bg-white border border-zinc-200 px-3 py-2">
                  <span className="text-sm sm:text-base">🔎</span>
                  <input 
                    value={query} 
                    onChange={(e)=>setQuery(e.target.value)} 
                    placeholder={t('medicine.searchPh')} 
                    className="w-full outline-none text-sm sm:text-base" 
                  />
                </div>
              </div>
            </div>
            <select 
              value={category} 
              onChange={(e)=>setCategory(e.target.value)} 
              className="w-full sm:w-48 px-3 py-2 rounded-lg sm:rounded-xl border border-zinc-300 text-sm sm:text-base"
            >
              {categories.map((c)=> <option key={c}>{c}</option>)}
            </select>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <select 
              value={sortBy} 
              onChange={(e)=>setSortBy(e.target.value)} 
              className="px-3 py-2 rounded-lg border border-zinc-300 text-sm sm:text-base"
            >
              <option value="name">{t('medicine.sortByName')}</option>
              <option value="price">{t('medicine.sortByPrice')}</option>
              <option value="stock">{t('medicine.sortByStock')}</option>
              <option value="expiry">{t('medicine.sortByExpiry')}</option>
            </select>
            
            <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-300 text-sm sm:text-base cursor-pointer">
              <input 
                type="checkbox" 
                checked={showPrescriptionOnly}
                onChange={(e)=>setShowPrescriptionOnly(e.target.checked)}
                className="rounded"
              />
              {t('medicine.prescriptionOnly')}
            </label>
          </div>
        </div>

        {/* Loading skeletons */}
        {isLoading && (
          <div className="space-y-4 sm:space-y-5">
            {[...Array(6)].map((_,i)=> (
              <div key={i} className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white border border-zinc-200">
                <div className="flex items-start gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <div className="w-24 space-y-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cart Sidebar */}
        {showCart && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
            <div className="w-full max-w-md bg-white h-full overflow-y-auto">
              <div className="p-4 border-b border-zinc-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold">{t('medicine.shoppingCart')}</h2>
                <button 
                  onClick={() => setShowCart(false)}
                  className="text-zinc-500 hover:text-zinc-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="p-4 space-y-4">
                {cart.length === 0 ? (
                  <p className="text-zinc-500 text-center py-8">{t('medicine.cartEmpty')}</p>
                ) : (
                  <>
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 border border-zinc-200 rounded-lg">
                        <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                          💊
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">{item.name}</h3>
                          <p className="text-xs text-zinc-500">{item.brand}</p>
                          <p className="text-sm font-semibold text-green-600">₹{item.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-full bg-zinc-200 flex items-center justify-center text-sm"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-full bg-zinc-200 flex items-center justify-center text-sm"
                          >
                            +
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          {t('medicine.remove')}
                        </button>
                      </div>
                    ))}
                    
                    <div className="border-t border-zinc-200 pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold">{t('medicine.total')}</span>
                        <span className="text-lg font-semibold text-green-600">₹{getTotalPrice()}</span>
                      </div>
                      <button className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 font-medium">
                        {t('medicine.checkout')}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
  
        {!isLoading && (
          <div className="space-y-4 sm:space-y-5">
            {filtered.map((m)=> (
              <div key={m.id} className="rounded-xl sm:rounded-2xl bg-white border border-zinc-200 shadow-sm p-4 sm:p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-100 text-orange-600 grid place-items-center text-sm sm:text-base flex-shrink-0">💊</div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <div className="text-lg sm:text-xl font-semibold truncate">{m.name}</div>
                          {m.prescriptionRequired && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Rx</span>
                          )}
                        </div>
                        <div className="text-xs sm:text-sm text-zinc-500">{t('medicine.brand')} {m.brand}</div>
                        <div className="text-xs sm:text-sm text-zinc-600 mt-1">{m.description}</div>
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-3 flex flex-wrap items-center gap-1 sm:gap-2">
                      {m.tags.map((tTag)=> <span key={tTag} className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">{tTag}</span>)}
                      <StockBadge stock={m.stock} />
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-right">
                      <div className="text-lg sm:text-xl font-semibold text-green-600">₹{m.price}</div>
                      <div className="text-xs text-zinc-500">{t('medicine.perUnit')}</div>
                    </div>
                    <button 
                      onClick={() => addToCart(m)}
                      disabled={m.stock === 'Out of Stock'}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:bg-zinc-300 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      {m.stock === 'Out of Stock' ? t('medicine.outOfStock') : t('medicine.addToCart')}
                    </button>
                  </div>
                </div>
  
                <div className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <span className="truncate">{m.pharmacy}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{t('medicine.dosage')}</span>
                    <span className="truncate">{m.dosage}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{t('medicine.expires')}</span>
                    <span>{m.expires}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{t('medicine.sideEffects')}</span>
                    <span className="truncate">{m.sideEffects}</span>
                  </div>
                </div>

                <div className="mt-3 sm:mt-4 p-3 bg-zinc-50 rounded-lg">
                  <div className="text-xs sm:text-sm">
                    <div className="font-medium mb-1">{t('medicine.interactionsTitle')}</div>
                    <div className="text-zinc-600">{m.interactions}</div>
                  </div>
                </div>
              </div>
            ))}
  
            {filtered.length === 0 && (
              <div className="text-center text-xs sm:text-sm text-zinc-500 py-8">
                <div className="text-4xl mb-2">🔍</div>
                <div>{t('medicine.noneFoundTitle')}</div>
                <div className="mt-1">{t('medicine.noneFoundTip')}</div>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
export default MedicineAvailability