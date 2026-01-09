import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { QrCode, ArrowRight, Car, Calendar, MapPin, Clock } from 'lucide-react'
import { api } from '../../../services/api'

export function UserHome() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [activeParking, setActiveParking] = useState(null)
  const [recentParking, setRecentParking] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    fetchParkingData()
  }, [])

  const fetchParkingData = async () => {
    try {
      const [activeData, historyData] = await Promise.all([
        api.parking.getActive(),
        api.parking.getHistory()
      ])
      setActiveParking(activeData.data)
      setRecentParking(historyData.data?.slice(0, 3) || [])
    } catch (error) {
      console.error('Error fetching parking data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleScanToPark = () => {
    navigate('/qr-scanner')
  }

  const handleViewAllHistory = () => {
    navigate('/history')
  }

  const handleParkingCardClick = (parking) => {
    navigate('/ticket', { state: { parking } })
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  }

  const formatDuration = (hours, minutes) => {
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Smart Parking Solutions
              </h1>
              <p className="text-xl lg:text-2xl text-white/90 mb-8">
                Welcome back, {user?.name || 'User'}! Find and reserve parking instantly with our intelligent system.
              </p>
              <div className="inline-block bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
                <p className="text-lg font-medium">#1 in India – Premium Parking Solution</p>
              </div>
            </div>
            
            <div className="flex justify-center lg:justify-end">
              <div className="w-80 h-80 lg:w-96 lg:h-96 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                <svg className="w-48 h-48 lg:w-56 lg:h-56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 9V7C20 5.89543 19.1046 5 18 5H6C4.89543 5 4 5.89543 4 7V9M20 9H4M20 9V17C20 18.1046 19.1046 19 18 19H6C4.89543 19 4 18.1046 4 17V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M8 15H8.01M16 15H16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <button 
              onClick={handleScanToPark}
              className="w-full bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-gray-100 hover:shadow-2xl transition-all group"
            >
              <div className="flex items-center gap-6 lg:gap-8">
                <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <QrCode className="w-12 h-12 lg:w-14 lg:h-14 text-indigo-600" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Scan to Park</h3>
                  <p className="text-lg text-gray-600">Scan QR code at parking entrance</p>
                </div>
                <ArrowRight className="w-8 h-8 text-gray-400 group-hover:text-indigo-600 transition-colors" />
              </div>
            </button>

            {activeParking && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Active Parking</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-indigo-600" />
                      <span className="font-medium text-gray-900">{activeParking.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-600">{formatTime(activeParking.entryTime)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Vehicle</span>
                    <span className="font-semibold text-gray-900">{activeParking.vehicle.vehicleNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Parked</span>
                    <span className="font-semibold text-indigo-600">
                      {formatDuration(activeParking.duration?.hours || 0, activeParking.duration?.minutes || 0)}
                    </span>
                  </div>
                  <button
                    onClick={() => navigate('/ticket')}
                    className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    View Ticket
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h4>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Parkings</span>
                  <span className="font-semibold text-gray-900">{recentParking.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active</span>
                  <span className="font-semibold text-green-600">{activeParking ? '1' : '0'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Recent Parking</h2>
            {recentParking.length > 0 && (
              <button 
                onClick={handleViewAllHistory}
                className="text-lg text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
              >
                View All History →
              </button>
            )}
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading...</p>
            </div>
          ) : recentParking.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No recent parking history</p>
              <p className="text-gray-500 mt-2">Start parking to see your history here</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentParking.map((parking) => (
                <div
                  key={parking.id}
                  onClick={() => handleParkingCardClick(parking)}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{parking.location}</h3>
                      <p className="text-gray-600 text-sm">{parking.address}</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Amount</span>
                      <span className="font-semibold text-green-600">₹{parking.totalAmount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Date</span>
                      <span className="text-gray-900">{formatDate(parking.entryTime)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Vehicle</span>
                      <span className="text-gray-900">{parking.vehicle.vehicleNumber}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Duration</span>
                      <span className="text-gray-900">
                        {formatDuration(parking.duration?.hours || 0, parking.duration?.minutes || 0)}
                      </span>
                    </div>
                  </div>
                  <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    completed
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">QR Code Parking</h3>
            <p className="text-gray-600">Scan and park instantly without any hassle</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ArrowRight className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Tracking</h3>
            <p className="text-gray-600">Track your parking duration and costs live</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Car className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Multiple Vehicles</h3>
            <p className="text-gray-600">Manage parking for all your vehicles</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">History & Reports</h3>
            <p className="text-gray-600">Detailed parking history and analytics</p>
          </div>
        </div>
      </div>
    </div>
  )
}