import React from 'react';

export function StatCard({ icon: Icon, label, value, iconColor = 'text-blue-600', iconBg = 'bg-blue-50' }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-2xl text-gray-900 mt-0.5">{value}</p>
        </div>
      </div>
    </div>
  );
}