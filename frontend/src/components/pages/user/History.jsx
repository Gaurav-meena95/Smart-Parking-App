import React from 'react'
import { Car } from 'lucide-react'

export function UserHistory() {
  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-8 lg:mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Parking History</h1>
          <p className="text-lg text-gray-600">0 total bookings</p>
        </div>
        
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Car className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No parking history yet</h3>
          <p className="text-gray-600">Start parking to see your history here</p>
        </div>
      </div>
    </div>
  )
}