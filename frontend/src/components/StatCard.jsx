import React from 'react'

export function StatCard({ icon: Icon, label, value, iconColor = 'text-blue-600', iconBg = 'bg-blue-50' }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 ${iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${iconColor}`} />
        </div>
        <div className="min-w-0">
          <p className="text-xs sm:text-sm text-gray-600">{label}</p>
          <p className="text-xl sm:text-2xl text-gray-900 mt-0.5 font-semibold">{value}</p>
        </div>
      </div>
    </div>
  )
}