import React, { useState } from 'react'

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
      <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <div className="rounded-xl sm:rounded-2xl border border-amber-100 bg-amber-50/60 p-2">
              <div className="flex items-center gap-2 rounded-lg sm:rounded-xl bg-white border border-zinc-200 px-3 py-2">
                <span className="text-sm sm:text-base">🔎</span>
                <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search for medicines..." className="w-full outline-none text-sm sm:text-base" />
              </div>
            </div>
          </div>
          <select value={category} onChange={(e)=>setCategory(e.target.value)} className="w-full sm:w-64 px-3 py-2 rounded-lg sm:rounded-xl border border-zinc-300 text-sm sm:text-base">
            {categories.map((c)=> <option key={c}>{c}</option>)}
          </select>
        </div>
  
        <div className="space-y-4 sm:space-y-5">
          {filtered.map((m)=> (
            <div key={m.id} className="rounded-xl sm:rounded-2xl bg-white border border-zinc-200 shadow-sm p-4 sm:p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-100 text-orange-600 grid place-items-center text-sm sm:text-base flex-shrink-0">💊</div>
                    <div className="min-w-0 flex-1">
                      <div className="text-lg sm:text-xl font-semibold truncate">{m.name}</div>
                      <div className="text-xs sm:text-sm text-zinc-500">Brand: {m.brand}</div>
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-3 flex flex-wrap items-center gap-1 sm:gap-2">
                    {m.tags.map((t)=> <span key={t} className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">{t}</span>)}
                    <StockBadge stock={m.stock} />
                  </div>
                </div>
                <button className="hidden sm:inline-flex px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 text-sm sm:text-base ml-2">Order Now</button>
              </div>
  
              <div className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm">
                <div className="flex items-center gap-2"><span>📍</span><span className="truncate">{m.pharmacy}</span></div>
                <div className="flex items-center gap-2"><span className="font-medium">Dosage:</span><span className="truncate">{m.dosage}</span></div>
                <div className="flex items-center gap-2"><span className="font-medium">Expires:</span><span>{m.expires}</span></div>
              </div>
  
              <div className="mt-2 sm:mt-3 flex items-center justify-between">
                <div className="text-xs sm:text-sm">Price: <span className="text-green-600 font-semibold">₹{m.price}</span></div>
                <button className="sm:hidden inline-flex px-3 py-1.5 rounded-lg bg-orange-500 text-white hover:bg-orange-600 text-xs">Order Now</button>
              </div>
            </div>
          ))}
  
          {filtered.length === 0 && (
            <div className="text-center text-xs sm:text-sm text-zinc-500 py-8">No results found. Try a different search or category.</div>
          )}
        </div>
      </div>
    )
  }
export default MedicineAvailability