import React from 'react'
import { Home, Ticket, History, Settings } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { icon: Home, label: 'Home', path: '/home' },
  { icon: Ticket, label: 'Ticket', path: '/ticket' },
  { icon: History, label: 'History', path: '/history' },
  { icon: Settings, label: 'Settings', path: '/settings' },
]

export function BottomNav() {
  const location = useLocation()

  return (
    <div className="fixed bottom-0 flex justify-center left-0 right-0 bg-white border-t border-gray-200  py-2 lg:relative lg:border-t-0 lg:bg-transparent lg:px-0 lg:py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-center lg:justify-center gap-2 lg:gap-15">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col lg:flex-row items-center gap-2 lg:gap-3 px-6 py-1 lg:py-2 rounded-xl transition-all ${
                isActive 
                  ? 'text-indigo-600 bg-indigo-50' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div
                className={`w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center rounded-xl transition-all ${
                  isActive ? 'bg-linear-to-r from-indigo-50 to-purple-50' : ''
                }`}
              >
                <Icon className="h-6 w-6 lg:w-5 lg:h-5" />
              </div>
              <span className="text-sm lg:text-base font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}