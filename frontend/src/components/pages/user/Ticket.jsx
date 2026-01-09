import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { QrCode, MapPin, Clock, Car } from 'lucide-react'

export function UserTicket() {
  const location = useLocation()
  const navigate = useNavigate()
  
  const [hasActiveSession, setHasActiveSession] = useState(
    location.state?.activeSession || false
  )
  
  const parkingData = location.state?.parking || location.state?.parkingData

  const handleStartParking = () => {
    navigate('/qr-scanner')
  }

  const handleEndParking = () => {
    setHasActiveSession(false);
    alert('Parking session ended successfully!');
    navigate('/history');
  };

  const currentSession = parkingData || {
    mallName: 'Phoenix Market City',
    location: 'Whitefield, Bangalore',
    entryTime: '14:30',
    vehicleNumber: 'KA 01 AB 1234',
    parkingSlot: 'A-45',
    level: 'Level 2'
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-8">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-8 lg:mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Current Ticket</h1>
          <p className="text-lg text-gray-600">
            {hasActiveSession ? 'Your active parking session' : 'No active parking session'}
          </p>
        </div>

        {hasActiveSession ? (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* QR Code Card */}
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-gray-100 text-center">
              <div className="w-64 h-64 lg:w-80 lg:h-80 mx-auto bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center mb-8">
                <QrCode className="w-32 h-32 lg:w-40 lg:h-40 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Scan QR Code at Exit</h3>
              <p className="text-gray-600 mb-6">Keep this code ready for quick exit</p>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200 mb-6">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-green-800 font-medium">Active Parking Session</p>
                    <p className="text-sm text-green-600">Started at {currentSession.entryTime}</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={handleEndParking}
                className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-4 rounded-xl hover:shadow-lg transition-all font-medium"
              >
                End Parking Session
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h4 className="text-xl font-semibold text-gray-900 mb-6">Session Details</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3 text-gray-600">
                      <MapPin className="w-5 h-5" />
                      <span className="font-medium">Location</span>
                    </div>
                    <span className="text-gray-900 font-medium">{currentSession.parkingLocation || currentSession.mallName}</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Clock className="w-5 h-5" />
                      <span className="font-medium">Entry Time</span>
                    </div>
                    <span className="text-gray-900 font-medium">{currentSession.entryTime}</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Car className="w-5 h-5" />
                      <span className="font-medium">Vehicle</span>
                    </div>
                    <span className="text-gray-900 font-medium">{currentSession.numberPlate || currentSession.vehicleNumber}</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3 text-gray-600">
                      <MapPin className="w-5 h-5" />
                      <span className="font-medium">Parking Slot</span>
                    </div>
                    <span className="text-gray-900 font-medium">{currentSession.level ? `${currentSession.level} - ${currentSession.parkingSlot}` : 'A-45'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h4 className="text-xl font-semibold text-gray-900 mb-6">Current Session</h4>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-indigo-600 mb-2">2h 15m</div>
                    <div className="text-gray-600">Duration</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">₹45</div>
                    <div className="text-gray-600">Current Cost</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-gray-100 text-center">
              <div className="w-64 h-64 lg:w-80 lg:h-80 mx-auto bg-gray-100 rounded-3xl flex items-center justify-center mb-8">
                <QrCode className="w-32 h-32 lg:w-40 lg:h-40 text-gray-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">No Active Parking Session</h3>
              <p className="text-xl text-gray-600 mb-8">Start a new parking session to generate your QR code</p>
              
              {parkingData && (
                <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                  <p className="text-gray-600 mb-2">Selected Location:</p>
                  <p className="text-xl font-semibold text-gray-900">{parkingData.parkingLocation || parkingData.mallName}</p>
                  <p className="text-gray-600">{parkingData.address || parkingData.location}</p>
                </div>
              )}
              
              <button 
                onClick={handleStartParking}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl hover:shadow-lg transition-all font-medium text-lg"
              >
                Start Parking Session
              </button>
            </div>

            <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-200">
              <h4 className="text-xl font-semibold text-indigo-800 mb-4">How it works:</h4>
              <div className="grid md:grid-cols-2 gap-4 text-indigo-700">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-indigo-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-bold">1</span>
                  </div>
                  <p>Scan QR code at entry to start parking</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-indigo-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-bold">2</span>
                  </div>
                  <p>Keep the QR code ready for exit</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-indigo-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-bold">3</span>
                  </div>
                  <p>Payment is processed automatically</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-indigo-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-bold">4</span>
                  </div>
                  <p>View history in the History section</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}