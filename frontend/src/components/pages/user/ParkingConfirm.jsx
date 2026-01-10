import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Car, MapPin, Smartphone, CreditCard, Banknote, Building2 } from 'lucide-react'
import { api } from '../../../services/api'

export function ConfirmParking() {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedPayment, setSelectedPayment] = useState('upi')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState(null)

  const scannedData = location.state?.scannedData || {
    parkingLocation: 'Phoenix Market City',
    address: 'Whitefield, Bangalore'
  }
  const selectedVehicle = location.state?.selectedVehicle

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  if (!selectedVehicle) {
    navigate('/vehicle-selection', { state: { scannedData } })
    return null
  }

  const paymentMethods = [
    {
      id: 'upi',
      name: 'UPI',
      icon: Smartphone,
      color: 'bg-purple-50 border-purple-200 text-purple-600',
      selectedColor: 'bg-purple-100 border-purple-400'
    },
    {
      id: 'netbanking',
      name: 'Netbanking',
      icon: Building2,
      color: 'bg-blue-50 border-blue-200 text-blue-600',
      selectedColor: 'bg-blue-100 border-blue-400'
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      color: 'bg-green-50 border-green-200 text-green-600',
      selectedColor: 'bg-green-100 border-green-400'
    },
    {
      id: 'cash',
      name: 'Cash',
      icon: Banknote,
      color: 'bg-orange-50 border-orange-200 text-orange-600',
      selectedColor: 'bg-orange-100 border-orange-400'
    }
  ];

  const handleBack = () => {
    navigate('/vehicle-selection', { state: { scannedData } })
  }

  const handleConfirmParking = async () => {
    setError('')
    setLoading(true)

    try {
      const data = await api.parking.start({
        vehicleId: selectedVehicle.id,
        location: scannedData.parkingLocation,
        address: scannedData.address,
        paymentMethod: selectedPayment
      })

      navigate('/ticket', {
        state: {
          activeSession: true,
          parkingData: data.data
        }
      })
    } catch (err) {
      setError(err.message || 'Failed to start parking')
    } finally {
      setLoading(false)
    }
  }

  const baseRate = 100
  const serviceFee = 30
  const gst = 20
  const totalAmount = baseRate + serviceFee + gst

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
          <div className="flex items-center gap-6">
            <button 
              onClick={handleBack}
              className="p-3 hover:bg-white/10 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold">Confirm Parking</h1>
              <p className="text-white/90 mt-2">Review your details and confirm parking</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Car className="w-6 h-6 text-gray-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Vehicle Details</h2>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Owner</span>
                  <span className="text-gray-900 font-semibold">{selectedVehicle.ownerName}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Vehicle</span>
                  <span className="text-gray-900 font-semibold">{selectedVehicle.vehicleName}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Number Plate</span>
                  <span className="text-gray-900 font-semibold">{selectedVehicle.vehicleNumber}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600 font-medium">phone</span>
                  <span className="text-gray-900 font-semibold">{user?.phone || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-gray-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Parking Location</h2>
              </div>

              <div>
                <h3 className="text-gray-900 font-semibold text-xl mb-2">{scannedData.parkingLocation}</h3>
                <p className="text-gray-600 text-lg">{scannedData.address}</p>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 sticky top-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Payment Method</h2>
              <p className="text-gray-600 mb-8">Choose how you want to pay</p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  const isSelected = selectedPayment === method.id;
                  
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`p-6 rounded-2xl border-2 transition-all ${
                        isSelected 
                          ? method.selectedColor 
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                          isSelected ? method.color : 'bg-gray-200'
                        }`}>
                          <Icon className={`w-8 h-8 ${
                            isSelected ? method.color.split(' ')[2] : 'text-gray-500'
                          }`} />
                        </div>
                        <span className={`font-medium ${
                          isSelected ? 'text-gray-900' : 'text-gray-600'
                        }`}>
                          {method.name}
                        </span>
                        {isSelected && (
                          <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mb-6 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Base Rate</span>
                  <span>₹{baseRate}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Service Fee</span>
                  <span>₹{serviceFee}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST (18%)</span>
                  <span>₹{gst}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-200">
                  <span>Total Amount</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4">
                  {error}
                </div>
              )}

              <button
                onClick={handleConfirmParking}
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl hover:shadow-lg transition-all font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Park My Car'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}