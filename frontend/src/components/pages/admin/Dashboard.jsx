import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { StatCard } from '../../../components/StatCard'
import { Ticket, DollarSign, Car, ChevronDown, TrendingUp, BarChart3, Users, Settings, CheckCircle, XCircle, MapPin, LogOut } from 'lucide-react'
import { api } from '../../../services/api'
import { useAuth } from '../../../context/AuthContext'

export function AdminDashboard() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [pendingDrivers, setPendingDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSite, setSelectedSite] = useState(null)
  const [showSiteDropdown, setShowSiteDropdown] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    fetchDashboardStats()
    if (activeTab === 'approvals') {
      fetchPendingDrivers()
    }
  }, [activeTab])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSiteDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (stats && stats.sites && stats.sites.length > 0 && !selectedSite) {
      setSelectedSite(stats.sites[0])
    }
  }, [stats])

  const fetchDashboardStats = async () => {
    try {
      const data = await api.admin.getDashboardStats()
      setStats(data.data)
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPendingDrivers = async () => {
    try {
      const data = await api.admin.getPendingDriverApprovals()
      setPendingDrivers(data.data || [])
    } catch (error) {
      console.error('Error fetching pending drivers:', error)
    }
  }

  const handleApproveDriver = async (userId) => {
    try {
      await api.admin.approveDriver(userId)
      await fetchPendingDrivers()
      alert('Driver approved successfully!')
    } catch (error) {
      alert('Failed to approve driver: ' + error.message)
    }
  }

  const handleRejectDriver = async (userId) => {
    if (!window.confirm('Are you sure you want to reject this driver?')) {
      return
    }
    try {
      await api.admin.rejectDriver(userId)
      await fetchPendingDrivers()
      alert('Driver rejected successfully!')
    } catch (error) {
      alert('Failed to reject driver: ' + error.message)
    }
  }

  const handleSiteSelect = (site) => {
    setSelectedSite(site)
    setShowSiteDropdown(false)
  }

  const handleViewAnalytics = () => {
    alert('Detailed Analytics - Coming Soon!')
  }

  const handleManageUsers = () => {
    alert('User Management - Coming Soon!')
  }

  const handleSystemSettings = () => {
    alert('System Settings - Coming Soon!')
  }

  const handleExportData = () => {
    alert('Data Export - Coming Soon!')
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Failed to load dashboard data</p>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-gray-50 pb-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="bg-indigo-600 text-white px-6 sm:px-8 py-8 sm:py-12 rounded-lg mb-6 sm:mb-8">
          <div className="max-w-4xl">
            <div className="flex justify-between  mb-6 ">
              <div className="">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Super Admin</h1>
                <p className="text-lg sm:text-xl text-white/90 mt-2">System overview and approvals</p>
              </div>
              <button
                onClick={handleLogout}
                className="self-end sm:self-auto p-2 sm:p-3 hover:bg-white/10 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
                title="Logout"
              >
                <LogOut className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 sm:px-6 py-2 sm:py-3 cursor-pointer rounded-lg font-medium transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-white text-indigo-600'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('approvals')}
                className={`px-4 sm:px-6 py-2 sm:py-3 cursor-pointer rounded-lg font-medium transition-colors ${
                  activeTab === 'approvals'
                    ? 'bg-white text-indigo-600'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                Approvals
              </button>
            </div>

            {activeTab === 'overview' && stats.sites && stats.sites.length > 0 && (
              <div className="relative max-w-md" ref={dropdownRef}>
                <label className="block text-sm text-white/90 mb-2">Select Site</label>
                <button 
                  onClick={() => setShowSiteDropdown(!showSiteDropdown)}
                  className="w-full bg-white/20 backdrop-blur-sm rounded-lg px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between hover:bg-white/30 transition-all cursor-pointer"
                >
                  <span className="text-base sm:text-lg">{selectedSite?.name || stats.sites[0]?.name || 'Select Site'}</span>
                  <ChevronDown className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform ${showSiteDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showSiteDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow border border-gray-200 overflow-hidden z-10">
                    {stats.sites.map((site) => (
                      <button
                        key={site.id}
                        onClick={() => handleSiteSelect(site)}
                        className={`w-full px-4 sm:px-6 py-3 sm:py-4 text-left hover:bg-gray-50 transition-colors cursor-pointer ${
                          selectedSite?.id === site.id ? 'bg-indigo-50 text-indigo-600' : 'text-gray-900'
                        }`}
                      >
                        {site.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {activeTab === 'overview' && (

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            <div className="bg-white rounded-lg p-6 sm:p-8 shadow border border-gray-200">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Today's Performance</h2>
                <button 
                  onClick={handleViewAnalytics}
                  className="text-indigo-600 hover:text-indigo-800 transition-colors font-medium text-sm sm:text-base cursor-pointer"
                >
                  View Details
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                <div>
                  <p className="text-gray-600 mb-2 text-sm sm:text-base">Tickets Issued</p>
                  <p className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">{stats.today.ticketsIssued}</p>
                  {stats.today.ticketsGrowth > 0 && (
                    <div className="flex items-center gap-2 text-green-600">
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-xs sm:text-sm font-medium">+{stats.today.ticketsGrowth}% from yesterday</span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-gray-600 mb-2 text-sm sm:text-base">Collection</p>
                  <p className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                    ₹{stats.today.collection >= 1000 ? (stats.today.collection / 1000).toFixed(1) + 'k' : stats.today.collection.toFixed(0)}
                  </p>
                  {stats.today.collectionGrowth > 0 && (
                    <div className="flex items-center gap-2 text-green-600">
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-xs sm:text-sm font-medium">+{stats.today.collectionGrowth}% from yesterday</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 sm:p-8 shadow border border-gray-200">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <button
                  onClick={handleViewAnalytics}
                  className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 sm:p-6 transition-all text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm sm:text-base">Analytics</p>
                      <p className="text-xs sm:text-sm text-gray-600">View detailed reports</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={handleManageUsers}
                  className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 sm:p-6 transition-all text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm sm:text-base">Users</p>
                      <p className="text-xs sm:text-sm text-gray-600">Manage user accounts</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={handleSystemSettings}
                  className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 sm:p-6 transition-all text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm sm:text-base">Settings</p>
                      <p className="text-xs sm:text-sm text-gray-600">System configuration</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={handleExportData}
                  className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 sm:p-6 transition-all text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm sm:text-base">Export</p>
                      <p className="text-xs sm:text-sm text-gray-600">Download data reports</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <div className="bg-white rounded-lg p-6 sm:p-8 shadow border border-gray-200">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Overall Statistics</h2>
              <div className="space-y-4 sm:space-y-6">
                <StatCard
                  icon={Ticket}
                  label="Total Tickets"
                  value={stats.overall.totalTickets.toLocaleString()}
                  iconColor="text-blue-600"
                  iconBg="bg-blue-50"
                />
                <StatCard
                  icon={DollarSign}
                  label="Total Collection"
                  value={`₹${stats.overall.totalCollection >= 100000 ? (stats.overall.totalCollection / 100000).toFixed(1) + 'L' : (stats.overall.totalCollection / 1000).toFixed(1) + 'k'}`}
                  iconColor="text-green-600"
                  iconBg="bg-green-50"
                />
                <StatCard
                  icon={Car}
                  label="Active parking"
                  value={stats.overall.activeparking}
                  iconColor="text-purple-600"
                  iconBg="bg-purple-50"
                />
              </div>
            </div>

            {selectedSite && (
              <div className="bg-white rounded-lg p-6 sm:p-8 shadow border border-gray-200">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Site Details</h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-indigo-600 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">{selectedSite.name}</p>
                      <p className="text-sm text-gray-600">{selectedSite.address || 'Mumbai, India'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        )}

        {activeTab === 'approvals' && (
          <div className="bg-white rounded-lg p-6 sm:p-8 shadow border border-gray-200">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Pending Driver Approvals</h2>
            
            {pendingDrivers.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">All Caught Up!</h3>
                <p className="text-gray-600">No pending driver approvals at the moment</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingDrivers.map((driver) => (
                  <div key={driver.id} className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{driver.name}</h3>
                        <p className="text-sm text-gray-600 mb-1">{driver.email}</p>
                        {driver.phone && (
                          <p className="text-sm text-gray-600">{driver.phone}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">Applied on {new Date(driver.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleApproveDriver(driver.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectDriver(driver.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}