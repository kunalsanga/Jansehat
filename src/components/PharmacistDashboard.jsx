import React, { useEffect, useState } from 'react'

function PharmacistDashboard() {
  const [query, setQuery] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [newMed, setNewMed] = useState({ name: '', manufacturer: '', price: '', stock: '' })
  const [medicines, setMedicines] = useState([])

  // Load dummy data from localStorage or seed initial data
  useEffect(() => {
    const stored = localStorage.getItem('pharmacy_medicines')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        const normalized = Array.isArray(parsed)
          ? parsed.map((m, idx) => ({
            id: Number(m.id) || idx + 1,
            name: m.name || '',
            manufacturer: m.manufacturer || '',
            price: Number(m.price) || 0,
            stock: Number(m.stock) || 0,
            category: m.category || 'General',
            expiry: m.expiry || '2025-12-31'
          }))
          : []
        setMedicines(normalized)
      } catch {
        setMedicines([])
      }
    } else {
      const seed = [
        { id: 1, name: 'Paracetamol 500mg', manufacturer: 'ABC Pharma', price: 20, stock: 50, category: 'Pain Relief', expiry: '2025-06-15' },
        { id: 2, name: 'Amoxicillin 250mg', manufacturer: 'HealWell', price: 45, stock: 30, category: 'Antibiotic', expiry: '2025-08-20' },
        { id: 3, name: 'Cetirizine 10mg', manufacturer: 'AllergyFree', price: 15, stock: 80, category: 'Allergy', expiry: '2026-01-10' },
        { id: 4, name: 'ORS Powder', manufacturer: 'Rehydrate', price: 10, stock: 100, category: 'Supplements', expiry: '2027-03-05' },
        { id: 5, name: 'Metformin 500mg', manufacturer: 'Glucare', price: 60, stock: 2, category: 'Diabetes', expiry: '2025-11-30' },
        { id: 6, name: 'Aspirin 75mg', manufacturer: 'HeartHealth', price: 15, stock: 45, category: 'Cardiac', expiry: '2025-09-01' },
        { id: 7, name: 'Vitamin D3', manufacturer: 'SunLife', price: 120, stock: 60, category: 'Supplements', expiry: '2026-04-12' },
        { id: 8, name: 'Ibuprofen 400mg', manufacturer: 'PainLess', price: 25, stock: 0, category: 'Pain Relief', expiry: '2025-07-20' },
        { id: 9, name: 'Azithromycin 500mg', manufacturer: 'BioTech', price: 80, stock: 15, category: 'Antibiotic', expiry: '2025-05-30' },
        { id: 10, name: 'Cough Syrup', manufacturer: 'Soothe', price: 95, stock: 8, category: 'Respiratory', expiry: '2025-12-01' },
        { id: 11, name: 'Insulin Glargine', manufacturer: 'DiabetCare', price: 450, stock: 4, category: 'Diabetes', expiry: '2025-03-15' },
        { id: 12, name: 'Omeprazole 20mg', manufacturer: 'GastricRelief', price: 30, stock: 90, category: 'Digestive', expiry: '2026-06-25' },
      ]
      setMedicines(seed)
      localStorage.setItem('pharmacy_medicines', JSON.stringify(seed))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('pharmacy_medicines', JSON.stringify(medicines))
  }, [medicines])

  const filtered = medicines.filter(m =>
    m.name.toLowerCase().includes(query.toLowerCase()) ||
    m.manufacturer.toLowerCase().includes(query.toLowerCase())
  )

  const updateStock = (id, delta) => {
    setMedicines(prev => prev.map(m => m.id === id ? { ...m, stock: Math.max(0, m.stock + delta) } : m))
  }

  const handleAdd = (e) => {
    e.preventDefault()
    if (!newMed.name.trim()) return alert('Name required')
    const nextId = medicines.length ? Math.max(...medicines.map(m => m.id)) + 1 : 1
    const med = {
      id: nextId,
      name: newMed.name.trim(),
      manufacturer: newMed.manufacturer.trim() || 'Unknown',
      price: Number(newMed.price) || 0,
      stock: Number(newMed.stock) || 0,
      category: 'New Entry',
      expiry: '2026-01-01'
    }
    setMedicines(prev => [med, ...prev])
    setNewMed({ name: '', manufacturer: '', price: '', stock: '' })
    setShowAdd(false)
  }

  // Calculate stats
  const totalItems = medicines.length;
  const lowStockItems = medicines.filter(m => m.stock < 10).length;
  const outOfStockItems = medicines.filter(m => m.stock === 0).length;

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Pharmacy Stock Updator</h1>
            <p className="text-slate-500 mt-1">Manage inventory, track stock levels, and update pricing.</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 font-medium"
          >
            <span>+</span> Add Medicine
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-blue-200 transition-colors">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Medicines</p>
              <h3 className="text-3xl font-extrabold text-slate-800 mt-2">{totalItems}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
              💊
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-amber-200 transition-colors">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Low Stock Alerts</p>
              <h3 className="text-3xl font-extrabold text-amber-600 mt-2">{lowStockItems}</h3>
            </div>
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
              ⚠️
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-red-200 transition-colors">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Out of Stock</p>
              <h3 className="text-3xl font-extrabold text-red-600 mt-2">{outOfStockItems}</h3>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
              🚫
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">

          {/* Controls */}
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative max-w-md w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by medicine name or manufacturer..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <select className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm cursor-pointer hover:bg-slate-50">
                <option>All Categories</option>
                <option>Pain Relief</option>
                <option>Antibiotics</option>
                <option>Supplements</option>
              </select>
            </div>
          </div>

          {/* Add Form Logic */}
          {showAdd && (
            <div className="p-6 bg-blue-50/50 border-b border-blue-100 animate-in slide-in-from-top-4 duration-200">
              <form onSubmit={handleAdd}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-blue-900">Add New Medicine</h3>
                  <button type="button" onClick={() => setShowAdd(false)} className="text-blue-400 hover:text-blue-600">✕</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <input required value={newMed.name} onChange={e => setNewMed(prev => ({ ...prev, name: e.target.value }))} placeholder="Medicine Name" className="px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <input value={newMed.manufacturer} onChange={e => setNewMed(prev => ({ ...prev, manufacturer: e.target.value }))} placeholder="Manufacturer" className="px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <input required value={newMed.price} onChange={e => setNewMed(prev => ({ ...prev, price: e.target.value }))} placeholder="Price (₹)" type="number" min="0" className="px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <input required value={newMed.stock} onChange={e => setNewMed(prev => ({ ...prev, stock: e.target.value }))} placeholder="Initial Stock" type="number" min="0" className="px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="mt-4 flex justify-end">
                  <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 text-slate-600 mr-2 hover:bg-white rounded-lg transition-colors">Cancel</button>
                  <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md font-medium transition-colors">Save Medicine</button>
                </div>
              </form>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Medicine Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price / Unit</th>
                  <th className="px-6 py-4">Stock Availability</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                      No medicines found matching your search.
                    </td>
                  </tr>
                ) : (
                  filtered.map((m) => {
                    const stockStatus = m.stock === 0 ? 'Out of Stock' : m.stock < 10 ? 'Low Stock' : 'In Stock';
                    const statusColor = m.stock === 0 ? 'bg-red-100 text-red-700' : m.stock < 10 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700';

                    return (
                      <tr key={m.id} className="group hover:bg-slate-50/80 transition-colors duration-150">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-800">{m.name}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{m.manufacturer}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                            {m.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-700">₹{m.price.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${m.stock < 10 ? 'bg-amber-500' : 'bg-blue-500'} transition-all duration-500`}
                                style={{ width: `${Math.min(100, (m.stock / 100) * 100)}%` }}
                              ></div>
                            </div>
                            <span className="font-mono text-sm font-semibold text-slate-700 w-8 text-right">{m.stock}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${m.stock === 0 ? 'bg-red-500' : m.stock < 10 ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                            {stockStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => updateStock(m.id, -1)}
                              disabled={m.stock <= 0}
                              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-red-600 hover:border-red-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                              title="Decrease Stock"
                            >
                              −
                            </button>
                            <button
                              onClick={() => updateStock(m.id, 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-emerald-600 hover:border-emerald-200 transition-all"
                              title="Increase Stock"
                            >
                              +
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
            <p>Showing {filtered.length} of {medicines.length} medicines</p>
            <div className="flex gap-4 mt-2 sm:mt-0">
              <button className="hover:text-slate-800 transition-colors">Export CSV</button>
              <button className="hover:text-slate-800 transition-colors">Print Inventory</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PharmacistDashboard
