import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Car, Plus, Edit2, Trash2 } from 'lucide-react'
import { api } from '../../../services/api'

export function ManageVehicles() {
  const navigate = useNavigate()
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ vehicleName: '', ownerName: '', vehicleType: 'car' })

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      const data = await api.vehicles.getAll()
      setVehicles(data.data || [])
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (vehicle) => {
    setEditingId(vehicle.id)
    setEditForm({
      vehicleName: vehicle.vehicleName,
      ownerName: vehicle.ownerName,
      vehicleType: vehicle.vehicleType
    })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditForm({ vehicleName: '', ownerName: '', vehicleType: 'car' })
  }

  const handleSaveEdit = async (vehicleId) => {
    try {
      await api.vehicles.update(vehicleId, {
        vehicleName: editForm.vehicleName,
        ownerName: editForm.ownerName,
        vehicleType: editForm.vehicleType
      })
      await fetchVehicles()
      setEditingId(null)
      alert('Vehicle updated successfully!')
    } catch (error) {
      alert('Failed to update vehicle: ' + error.message)
    }
  }

  const handleDelete = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to remove this vehicle?')) {
      return
    }
    try {
      await api.vehicles.delete(vehicleId)
      await fetchVehicles()
      alert('Vehicle removed successfully!')
    } catch (error) {
      alert('Failed to remove vehicle: ' + error.message)
    }
  }

  const handleAddNew = () => {
    navigate('/add-vehicle', { state: { returnTo: '/manage-vehicles' } })
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-8">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-8">
          <button
            onClick={() => navigate('/settings')}
            className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Settings
          </button>
          <div className="flex items-center justify-between mt-5 mb-6">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Manage Vehicles</h1>
              <p className="text-lg text-gray-600">{vehicles.length} vehicles registered</p>
            </div>
            <button
              onClick={handleAddNew}
              className="bg-indigo-600 text-sm lg:text-xl text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1"
            >
              <Plus className="w-5 h-5" />
              Add New Vehicle
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow border border-gray-200">
            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
              <Car className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No vehicles registered</h3>
            <p className="text-gray-600 mb-8">Add your first vehicle to get started</p>
            <button
              onClick={handleAddNew}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add New Vehicle
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-white rounded-lg p-6 shadow border border-gray-200">
                {editingId === vehicle.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Name</label>
                      <input
                        type="text"
                        value={editForm.vehicleName}
                        onChange={(e) => setEditForm({ ...editForm, vehicleName: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name</label>
                      <input
                        type="text"
                        value={editForm.ownerName}
                        onChange={(e) => setEditForm({ ...editForm, ownerName: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
                      <select
                        value={editForm.vehicleType}
                        onChange={(e) => setEditForm({ ...editForm, vehicleType: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="car">Car</option>
                        <option value="bike">Bike</option>
                        <option value="suv">SUV</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Number</label>
                      <input
                        type="text"
                        value={vehicle.vehicleNumber}
                        disabled
                        className="w-full px-4 py-2 bg-gray-100 rounded-lg border border-gray-200 text-gray-500 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">Vehicle number cannot be changed</p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleSaveEdit(vehicle.id)}
                        className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <Car className="w-7 h-7 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{vehicle.vehicleName}</h3>
                        <p className="text-gray-600 mb-1">{vehicle.vehicleNumber}</p>
                        <p className="text-sm text-gray-500">{vehicle.ownerName}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(vehicle)}
                        className="p-2.5 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(vehicle.id)}
                        className="p-2.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
