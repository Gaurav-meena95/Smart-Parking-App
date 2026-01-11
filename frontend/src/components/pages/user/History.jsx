import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Car, MapPin } from 'lucide-react'
import { api } from '../../../services/api'

export function UserHistory() {
  const navigate = useNavigate()
  const [parkings, setparkings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const data = await api.parking.getHistory()
      setparkings(data.data || [])
    } catch (error) {
      console.error('Error fetching history:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const formatDuration = (hours, minutes) => {
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-8">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
        <div className="bg-linear-to-r from-indigo-600  to-purple-800  mb-8 lg:mb-12 rounded-2xl">
          <div className='p-5 '>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">parking History</h1>
            <p className="text-lg text-gray-300/70">{parkings.length} total bookings</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : parkings.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Car className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No parking history yet</h3>
            <p className="text-gray-600">Start parking to see your history here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {parkings.map((parking) => (
              <div
                key={parking.id}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{parking.location}</h3>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{parking.address}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600 mb-1">₹{parking.totalAmount}</div>
                    <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      completed
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium text-gray-900">{formatDate(parking.entryTime)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Vehicle</p>
                    <p className="font-medium text-gray-900">{parking.vehicle.vehicleNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-medium text-gray-900">
                      {formatDuration(parking.duration?.hours || 0, parking.duration?.minutes || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment</p>
                    <p className="font-medium text-gray-900 capitalize">{parking.paymentMethod}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}