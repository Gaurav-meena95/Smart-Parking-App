import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { QrCode, MapPin, Clock, Car, Download, Share2 } from 'lucide-react'
import { api } from '../../../services/api'

export function UserTicket() {
  const navigate = useNavigate()
  
  const [activeParking, setActiveParking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qrCodeURL, setQrCodeURL] = useState('')

  useEffect(() => {
    fetchActiveParking()
  }, [])

  useEffect(() => {
    if (activeParking) {
      const qrData = generateQRCodeData(activeParking)
      const qrURL = generateQRCodeURL(qrData)
      setQrCodeURL(qrURL)
    }
  }, [activeParking])

  const fetchActiveParking = async () => {
    try {
      const data = await api.parking.getActive()
      setActiveParking(data.data)
    } catch (error) {
      console.error('Error fetching active parking:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStartParking = () => {
    navigate('/qr-scanner')
  }

  const handleEndParking = async () => {
    if (!activeParking) return
    
    try {
      await api.parking.end(activeParking.id)
      alert('Parking session ended successfully!')
      navigate('/history')
    } catch (error) {
      alert('Failed to end parking session: ' + error.message)
    }
  }

  const handleDownloadTicket = () => {
    if (!activeParking || !qrCodeURL) return
    
    const link = document.createElement('a')
    link.href = qrCodeURL
    link.download = `parking-ticket-${activeParking.ticketId}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-8">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-8 lg:mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Parking Ticket</h1>
          <p className="text-lg text-gray-600">
            {activeParking ? 'Active Parking Session' : 'No active parking session'}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : activeParking ? (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-gray-100 text-center">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Smart Parking System</h2>
                <p className="text-gray-600">Digital Parking Ticket</p>
              </div>
              
              <div className="w-64 h-64 lg:w-80 lg:h-80 mx-auto bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center mb-8 overflow-hidden">
                {qrCodeURL ? (
                  <img 
                    src={qrCodeURL} 
                    alt="Parking Ticket QR Code"
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <QrCode className="w-32 h-32 lg:w-40 lg:h-40 text-indigo-600" />
                )}
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-center gap-2">
                  <Download className="w-5 h-5 text-indigo-600" />
                  <button className="text-indigo-600 hover:text-indigo-800 font-medium">Download Ticket</button>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Share2 className="w-5 h-5 text-indigo-600" />
                  <button className="text-indigo-600 hover:text-indigo-800 font-medium">Share Ticket</button>
                </div>
              </div>

              <p className="text-sm text-gray-500 mb-6">📱 Keep this ticket handy</p>
              <p className="text-sm text-gray-500 mb-6">Show this QR code when retrieving your vehicle</p>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200 mb-6">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-green-800 font-medium">Active Parking Session</p>
                    <p className="text-sm text-green-600">Started at {formatTime(activeParking.entryTime)}</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={handleEndParking}
                className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-4 rounded-xl hover:shadow-lg transition-all font-medium"
              >
                Get My Car
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
                    <span className="text-gray-900 font-medium">{activeParking.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3 text-gray-600">
                      <span className="font-medium">Ticket ID</span>
                    </div>
                    <span className="text-gray-900 font-medium">{activeParking.ticketId}</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Car className="w-5 h-5" />
                      <span className="font-medium">Vehicle</span>
                    </div>
                    <span className="text-gray-900 font-medium">{activeParking.vehicle.vehicleName} - {activeParking.vehicle.vehicleNumber}</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3 text-gray-600">
                      <MapPin className="w-5 h-5" />
                      <span className="font-medium">Address</span>
                    </div>
                    <span className="text-gray-900 font-medium text-right">{activeParking.address}</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Clock className="w-5 h-5" />
                      <span className="font-medium">Entry Time</span>
                    </div>
                    <span className="text-gray-900 font-medium">{formatDate(activeParking.entryTime)}, {formatTime(activeParking.entryTime)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h4 className="text-xl font-semibold text-gray-900 mb-6">Current Session</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="text-2xl font-bold text-indigo-600">
                      {formatDuration(activeParking.duration?.hours || 0, activeParking.duration?.minutes || 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-gray-600">Amount Paid</span>
                    <span className="text-2xl font-bold text-green-600">₹{activeParking.totalAmount}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-200 text-center">
                <p className="text-sm text-indigo-800">Powered by Smart Parking</p>
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