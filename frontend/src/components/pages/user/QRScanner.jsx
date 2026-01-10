import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Camera } from 'lucide-react'
import { Html5Qrcode } from 'html5-qrcode'
import { api } from '../../../services/api'

export function QRScanner() {
  const navigate = useNavigate()
  const scannerRef = useRef(null)

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("qr-reader")
    scannerRef.current = html5QrCode

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 }
    }

    html5QrCode.start(
      { facingMode: "environment" },
      config,
      async (decodedText) => {
        try {
          await html5QrCode.stop()

          let scannedData
          try {
            scannedData = JSON.parse(decodedText)
          } catch (e) {
            scannedData = { spotId: decodedText }
          }

          if (scannedData.type === 'parking_spot' || scannedData.spotId) {
            navigate('/vehicle-selection', { state: { scannedData } })
          } else if (scannedData.type === 'parking_ticket' || scannedData.ticketId) {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL ||VITE_API_BASE_URL }/parking/qr/${encodeURIComponent(decodedText)}`, {
              headers: {
                'Authorization': `JWT ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
              }
            })

            if (!response.ok) {
              throw new Error('Invalid parking ticket')
            }

            const result = await response.json()
            if (result.success && result.data) {
              navigate('/ticket', { state: { parkingData: result.data } })
            } else {
              throw new Error('Invalid parking data')
            }
          } else {
            throw new Error('Invalid QR Code format')
          }
        } catch (err) {
          alert('Invalid QR Code. Please scan a valid parking spot or ticket QR code.')
          window.location.reload()
        }
      }
    ).catch(err => console.error("Camera start error:", err))

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(e => console.error(e))
      }
    }
  }, [navigate])

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6">


        <div className="py-8 flex items-center gap-4">
          <button
            onClick={() => navigate('/home')}
            className="p-3 hover:bg-white/10 rounded-lg"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-xl font-medium text-white">Scan QR Code</h1>
        </div>


        <div className="relative flex justify-center py-12">
          <div className="relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden border border-gray-800">


            <div id="qr-reader" className="w-full h-full" />


            <div className="absolute inset-0 pointer-events-none border-[40px] border-black/40">
              <div className="w-full h-full border-2 border-purple-500 relative">
                <div className="absolute -top-1 -left-1 w-6 h-6 border-l-4 border-t-4 border-purple-500" />
                <div className="absolute -top-1 -right-1 w-6 h-6 border-r-4 border-t-4 border-purple-500" />
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-l-4 border-b-4 border-purple-500" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-r-4 border-b-4 border-purple-500" />
              </div>
            </div>
          </div>
        </div>


        <div className="text-center space-y-8 pb-12">
          <div>
            <p className="text-xl font-medium text-white mb-2">Position the QR code</p>
            <p className="text-gray-400">Scan the QR code on the parking spot</p>
          </div>

          <div className="space-y-4 max-w-sm mx-auto">
            <div className="flex items-center justify-center gap-3 py-4 bg-white/5 rounded-xl border border-white/10">
              <Camera className="w-5 h-5 text-purple-500 animate-pulse" />
              <span className="text-white font-medium">Camera Active</span>
            </div>

            <button
              onClick={() => navigate('/vehicle-selection')}
              className="w-full py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors"
            >
              Skip & Enter Manually
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}