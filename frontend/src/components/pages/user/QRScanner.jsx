import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, QrCode, Camera } from 'lucide-react'

export function QRScanner() {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setTimeout(() => {
              handleScanSuccess()
            }, 500)
            return 100
          }
          return prev + 10
        })
      }, 300)
      return () => clearInterval(interval)
    }
  }, [isScanning])

  const handleBack = () => {
    navigate('/');
  };

  const handleStartScan = () => {
    setIsScanning(true);
    setScanProgress(0);
  };

  const handleScanSuccess = () => {
    const scannedData = {
      owner: 'John Doe',
      vehicle: 'Toyota Camry',
      numberPlate: 'MH 12 AB 1234',
      mobile: '+91 98765 43210',
      parkingLocation: 'Inorbit Mall',
      address: 'Malad West, Mumbai'
    }
    navigate('/confirm-parking', { state: { scannedData } })
  }

  const handleManualEntry = () => {
    const defaultData = {
      owner: 'Rahul Sharma',
      vehicle: 'Honda City',
      numberPlate: 'KA 01 AB 1234',
      mobile: '+91 98765 43210',
      parkingLocation: 'Phoenix Market City',
      address: 'Whitefield, Bangalore'
    }
    navigate('/confirm-parking', { state: { scannedData: defaultData } })
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto">
        <div className="bg-black text-white px-6 lg:px-8 py-8 relative z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleBack}
              className="p-3 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl lg:text-3xl font-medium">Scan QR Code</h1>
          </div>
        </div>

        <div className="relative flex items-center justify-center px-6 lg:px-8 py-12">
          <div className="relative w-full max-w-lg aspect-square">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="grid grid-cols-8 h-full">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div 
                      key={i} 
                      className="border border-gray-600 animate-pulse"
                      style={{ animationDelay: `${i * 50}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute inset-12 border-2 border-white rounded-2xl">
              <div className="absolute -top-1 -left-1 w-8 h-8 border-l-4 border-t-4 border-purple-500 rounded-tl-lg"></div>
              <div className="absolute -top-1 -right-1 w-8 h-8 border-r-4 border-t-4 border-purple-500 rounded-tr-lg"></div>
              <div className="absolute -bottom-1 -left-1 w-8 h-8 border-l-4 border-b-4 border-purple-500 rounded-bl-lg"></div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 border-r-4 border-b-4 border-purple-500 rounded-br-lg"></div>

              {isScanning && (
                <div 
                  className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse"
                  style={{ 
                    top: `${scanProgress}%`,
                    transition: 'top 0.3s ease-in-out'
                  }}
                />
              )}

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>

            {isScanning && (
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-black/50 rounded-2xl p-4">
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-purple-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                  <p className="text-white text-center mt-3 font-medium">
                    {scanProgress < 100 ? 'Scanning...' : 'Scan Complete!'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="px-6 lg:px-8 pb-12">
          <div className="text-center text-white space-y-6 max-w-md mx-auto">
            <div>
              <p className="text-xl lg:text-2xl font-medium mb-3">Position the QR code within the frame</p>
              <p className="text-gray-400">
                Make sure the QR code is clearly visible and well-lit for best results
              </p>
            </div>

            {!isScanning ? (
              <div className="space-y-4">
                <button
                  onClick={handleStartScan}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 lg:py-5 rounded-xl hover:shadow-lg transition-all font-medium flex items-center justify-center gap-3 text-lg"
                >
                  <Camera className="w-6 h-6" />
                  Start Scanning
                </button>
                
                <button
                  onClick={handleManualEntry}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white py-4 lg:py-5 rounded-xl transition-all font-medium text-lg"
                >
                  Skip QR Scan
                </button>
              </div>
            ) : (
              <div className="w-full bg-gray-700 text-gray-400 py-4 lg:py-5 rounded-xl font-medium text-lg">
                Scanning in progress...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

