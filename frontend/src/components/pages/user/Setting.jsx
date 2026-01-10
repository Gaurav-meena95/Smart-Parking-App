import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Car, CreditCard, HelpCircle, FileText, Edit2, LogOut } from 'lucide-react'
import { api } from '../../../services/api'
import { useAuth } from '../../../context/AuthContext'

export function UserSettings() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [vehicleCount, setVehicleCount] = useState(0)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    fetchVehicleCount()
  }, [])

  const fetchVehicleCount = async () => {
    try {
      const data = await api.vehicles.getAll()
      setVehicleCount(data.data?.length || 0)
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    }
  }

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
    navigate('/manage-vehicles')
  }


  const handleTransactionHistory = () => {
    navigate('/history');
  };

  const handleHelpSupport = () => {
    navigate('/help-support')
  }

  const handleFAQ = () => {
    navigate('/faq')
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout()
      localStorage.removeItem('user')
      navigate('/landing')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-y-auto pb-24 lg:pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className='bg-linear-to-r from-indigo-600  to-purple-800  mb-8 lg:mb-12 rounded-2xl'>
          <div className="mb-6 p-5 sm:mb-8 lg:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">Settings</h1>
            <p className="text-base sm:text-lg text-gray-300/70">Manage your account and preferences</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 sm:p-8 shadow border border-gray-200 text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-2xl sm:text-3xl mx-auto mb-4 sm:mb-6">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{user?.name || 'User'}</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">{user?.email || ''}</p>
              <button
                onClick={handleEditProfile}
                className="w-full bg-indigo-600 text-white py-2.5 sm:py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
                Edit Profile
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            <button
              onClick={handleManageVehicles}
              className="w-full bg-white rounded-lg p-4 sm:p-6 shadow border border-gray-200 hover:shadow-md transition-all text-left"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Car className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Manage Vehicles</h3>
                  <p className="text-sm sm:text-base text-gray-600">{vehicleCount} vehicles saved</p>
                </div>
              </div>
            </button>

            <button
              onClick={handleTransactionHistory}
              className="w-full bg-white rounded-lg p-4 sm:p-6 shadow border border-gray-200 hover:shadow-md transition-all text-left"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Transaction History</h3>
                  <p className="text-sm sm:text-base text-gray-600">View payment history</p>
                </div>
              </div>
            </button>

            <button
              onClick={handleHelpSupport}
              className="w-full bg-white rounded-lg p-4 sm:p-6 shadow border border-gray-200 hover:shadow-md transition-all text-left"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Help & Support</h3>
                  <p className="text-sm sm:text-base text-gray-600">Get help with parking</p>
                </div>
              </div>
            </button>

            <button
              onClick={handleFAQ}
              className="w-full bg-white rounded-lg p-4 sm:p-6 shadow border border-gray-200 hover:shadow-md transition-all text-left"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">FAQ</h3>
                  <p className="text-sm sm:text-base text-gray-600">Frequently asked questions</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="mt-8 lg:mt-12 pt-6 lg:pt-8 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full bg-red-100 hover:bg-red-200 text-red-600 py-3 sm:py-4 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}