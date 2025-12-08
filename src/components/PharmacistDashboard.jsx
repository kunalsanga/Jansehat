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
        // Ensure numeric fields are numbers (in case they were saved as strings)
        const normalized = Array.isArray(parsed)
          ? parsed.map((m, idx) => ({
              id: Number(m.id) || idx + 1,
              name: m.name || '',
              manufacturer: m.manufacturer || '',
              price: Number(m.price) || 0,
              stock: Number(m.stock) || 0,
            }))
          : []
        setMedicines(normalized)
      } catch {
        setMedicines([])
      }
    } else {
      const seed = [
        { id: 1, name: 'Paracetamol 500mg', manufacturer: 'ABC Pharma', price: 20, stock: 50 },
        { id: 2, name: 'Amoxicillin 250mg', manufacturer: 'HealWell', price: 45, stock: 30 },
        { id: 3, name: 'Cetirizine 10mg', manufacturer: 'AllergyFree', price: 15, stock: 80 },
        { id: 4, name: 'ORS Powder', manufacturer: 'Rehydrate', price: 10, stock: 100 },
        { id: 5, name: 'Metformin 500mg', manufacturer: 'Glucare', price: 60, stock: 20 },
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
    }
    setMedicines(prev => [med, ...prev])
    setNewMed({ name: '', manufacturer: '', price: '', stock: '' })
    setShowAdd(false)
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Pharmacist Dashboard</h1>
            <p className="text-sm text-slate-600">Manage medicines and stock</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search medicine or manufacturer"
              className="px-3 py-2 border border-slate-300 rounded-md text-sm w-64"
            />
            <button
              onClick={() => setShowAdd(s => !s)}
              className="px-3 py-2 bg-slate-700 text-white rounded-md text-sm"
            >
              {showAdd ? 'Cancel' : 'Add Medicine'}
            </button>
          </div>
        </div>

        {showAdd && (
          <form onSubmit={handleAdd} className="mb-6 p-4 border border-slate-200 rounded-md bg-gray-50">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input value={newMed.name} onChange={e => setNewMed(prev => ({ ...prev, name: e.target.value }))} placeholder="Medicine name" className="px-3 py-2 border rounded" />
              <input value={newMed.manufacturer} onChange={e => setNewMed(prev => ({ ...prev, manufacturer: e.target.value }))} placeholder="Manufacturer" className="px-3 py-2 border rounded" />
              <input value={newMed.price} onChange={e => setNewMed(prev => ({ ...prev, price: e.target.value }))} placeholder="Price" type="number" className="px-3 py-2 border rounded" />
              <input value={newMed.stock} onChange={e => setNewMed(prev => ({ ...prev, stock: e.target.value }))} placeholder="Stock" type="number" className="px-3 py-2 border rounded" />
            </div>
            <div className="mt-3 text-right">
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Add</button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 gap-3">
          {filtered.length === 0 && (
            <div className="p-4 text-center text-slate-500">No medicines found</div>
          )}

          {filtered.map(m => {
            const isLow = Number(m.stock) <= 3
            return (
              <div
                key={m.id}
                className={`flex items-center justify-between p-3 border rounded ${
                  isLow ? 'border-red-200 bg-red-50' : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="font-medium text-slate-800">{m.name}</div>
                  <div className="text-xs text-slate-500">{m.manufacturer} • ₹{m.price}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1 border rounded-md">
                    <button onClick={() => updateStock(m.id, -1)} className="text-lg text-slate-600">−</button>
                    <div className={`w-8 text-center font-medium ${isLow ? 'text-red-600' : ''}`}>{m.stock}</div>
                    <button onClick={() => updateStock(m.id, +1)} className="text-lg text-slate-600">+</button>
                  </div>
                  {isLow && (
                    <div className="text-xs text-white bg-red-600 px-2 py-0.5 rounded">Low stock</div>
                  )}
                  <div className="text-xs text-slate-500">ID: {m.id}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default PharmacistDashboard
