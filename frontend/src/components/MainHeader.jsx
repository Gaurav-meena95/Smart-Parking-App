import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Car, Menu, Bell, User } from 'lucide-react';

export function WebsiteHeader({ currentRole }) {
  const location = useLocation();

  const navItems = [
    { path: '/home', label: 'Home' },
    { path: '/history', label: 'History' },
    { path: '/ticket', label: 'parking' },
    { path: '/settings', label: 'Settings' },
  ];

  const managerNavItems = [
    { path: '/manager', label: 'Dashboard' },
    { path: '/manager/add-driver', label: 'Add Driver' },
  ];

  const getNavItems = () => {
    switch (currentRole) {
      case 'manager':
        return managerNavItems;
      case 'driver':
        return [{ path: '/driver', label: 'Console' }];
      case 'admin':
        return [{ path: '/admin', label: 'Dashboard' }];
      default:
        return navItems;
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Car className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Smart parking</h1>
              <p className="text-sm text-gray-600 hidden lg:block">Intelligent parking Solutions</p>
            </div>
          </div>

          phoneDesktop Navigation 
          <nav className="hidden lg:flex items-center gap-8">
            {getNavItems().map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    isActive
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>


          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-600 cursor-pointer hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 cursor-pointer hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
              <User className="w-5 h-5" />
            </button>
            <button className="lg:hidden p-2 text-gray-600 cursor-pointer hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}