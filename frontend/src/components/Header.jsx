import React from 'react';
import { ArrowLeft, Bell } from 'lucide-react';

export function Header({
  title,
  subtitle,
  showBack = false,
  showNotification = false,
  gradient = false,
  onBack,
}) {
  const baseClasses = 'px-6 py-6';
  const gradientClasses = gradient
    ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white'
    : 'bg-white';

  return (
    <div className={`${baseClasses} ${gradientClasses}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBack && (
            <button onClick={onBack} className="p-2 -ml-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer">
              <ArrowLeft className={`w-6 h-6 ${gradient ? 'text-white' : 'text-gray-900'}`} />
            </button>
          )}
          <div>
            <h1 className={`text-2xl ${gradient ? 'text-white' : 'text-gray-900'}`}>
              {title}
            </h1>
            {subtitle && (
              <p className={`text-sm mt-1 ${gradient ? 'text-white/80' : 'text-gray-600'}`}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {showNotification && (
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer">
            <Bell className={`w-6 h-6 ${gradient ? 'text-white' : 'text-gray-900'}`} />
          </button>
        )}
      </div>
    </div>
  );
}