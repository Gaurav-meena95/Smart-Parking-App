import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Car, CreditCard, HelpCircle, FileText, Edit2 } from 'lucide-react'
import { api } from '../../../services/api'

export function UserSettings() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleEditProfile = async () => {
    const newName = prompt('Enter your new name:', user?.name || '')
    if (newName && newName.trim()) {
      setLoading(true)
      try {
        const data = await api.users.updateProfile({ name: newName.trim() })
        setUser(data.data)
        localStorage.setItem('user', JSON.stringify(data.data))
        alert('Profile updated successfully!')
      } catch (error) {
        alert('Failed to update profile: ' + error.message)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleManageVehicles = () => {
    alert('Vehicle management - Coming Soon!')
  }

  const handleTransactionHistory = () => {
    navigate('/history');
  };

  const handleHelpSupport = () => {
    alert('Help & Support functionality - Coming Soon!');
  };

  const handleFAQ = () => {
    alert('FAQ functionality - Coming Soon!');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-8">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-8 lg:mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-lg text-gray-600">Manage your account and preferences</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-6">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{user?.name || 'User'}</h3>
              <p className="text-gray-600 mb-6">{user?.email || ''}</p>
              <button 
                onClick={handleEditProfile}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2"
              >
                <Edit2 className="w-5 h-5" />
                Edit Profile
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <button
              onClick={handleManageVehicles}
              className="w-full bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <Car className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Manage Vehicles</h3>
                  <p className="text-gray-600">Add or edit your vehicles</p>
                </div>
              </div>
            </button>
            
            <button
              onClick={handleTransactionHistory}
              className="w-full bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
                  <p className="text-gray-600">View payment history</p>
                </div>
              </div>
            </button>
            
            <button
              onClick={handleHelpSupport}
              className="w-full bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <HelpCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Help & Support</h3>
                  <p className="text-gray-600">Get help with parking</p>
                </div>
              </div>
            </button>
            
            <button
              onClick={handleFAQ}
              className="w-full bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">FAQ</h3>
                  <p className="text-gray-600">Frequently asked questions</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}