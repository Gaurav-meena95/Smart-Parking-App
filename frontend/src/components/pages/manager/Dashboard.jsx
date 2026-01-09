import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '../../StatCard';
import { Car, Clock, Ticket, DollarSign, Search, Phone, MapPin, Plus } from 'lucide-react';
import { api } from '../../../services/api';

export function ManagerDashboard() {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    activeCars: 0,
    retrieving: 0,
    totalToday: 0,
    revenue: 0
  });
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const filters = ['All', 'Parked', 'Retrieving', 'Retrieved'];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetchAssignments();
  }, [selectedFilter, searchQuery]);

  const fetchDashboardData = async () => {
    try {
      const data = await api.manager.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = async () => {
    try {
      const response = await api.manager.getParkingAssignments(
        selectedFilter === 'All' ? null : selectedFilter,
        searchQuery || null
      );
      setAssignments(response.assignments || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      setAssignments([]);
    }
  };

  const handleAddDriver = () => {
    navigate('/manager/add-driver');
  };

  const handleCallCustomer = (phone) => {
    if (phone && phone !== 'N/A') {
      window.location.href = `tel:${phone}`;
    }
  };

  const handleCallValet = (valet) => {
    alert(`Calling valet: ${valet}`);
  };

  const handleReassignValet = async (assignmentId) => {
    try {
      const drivers = await api.manager.getAvailableDrivers();
      if (drivers.drivers && drivers.drivers.length > 0) {
        const driverNames = drivers.drivers.map(d => d.name);
        const selectedDriver = prompt(`Select driver:\n${driverNames.map((d, i) => `${i + 1}. ${d}`).join('\n')}\nEnter number:`);
        if (selectedDriver) {
          const driverIndex = parseInt(selectedDriver) - 1;
          if (driverIndex >= 0 && driverIndex < drivers.drivers.length) {
            const driverId = drivers.drivers[driverIndex].id;
            await api.manager.reassignValet(assignmentId, driverId);
            alert('Valet reassigned successfully');
            fetchAssignments();
          }
        }
      } else {
        alert('No available drivers');
      }
    } catch (error) {
      console.error('Error reassigning valet:', error);
      alert('Failed to reassign valet');
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">Manager Dashboard</h1>
              <p className="text-xl text-white/90">Add Driver</p>
              <p className="text-lg text-white/80 mt-1">Manage valet assignments and parking operations</p>
            </div>
            
            <button
              onClick={handleAddDriver}
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all font-medium"
            >
              <Plus className="w-5 h-5" />
              Add New Driver
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={Car} 
            label="Active Cars" 
            value={stats.activeCars}
            iconColor="text-blue-600"
            iconBg="bg-blue-50"
          />
          <StatCard 
            icon={Clock} 
            label="Retrieving" 
            value={stats.retrieving}
            iconColor="text-orange-600"
            iconBg="bg-orange-50"
          />
          <StatCard 
            icon={Ticket} 
            label="Total Today" 
            value={stats.totalToday}
            iconColor="text-green-600"
            iconBg="bg-green-50"
          />
          <StatCard 
            icon={DollarSign} 
            label="Revenue" 
            value={`₹${stats.revenue.toLocaleString()}`}
            iconColor="text-purple-600"
            iconBg="bg-purple-50"
          />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by plate, customer or valet..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                    selectedFilter === filter
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter} {filter !== 'All' && `(${assignments.filter(a => a.status === filter).length})`}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {assignments.length === 0 ? (
            <div className="lg:col-span-2 bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Car className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No assignments found</h3>
              <p className="text-gray-600">No assignments match your current criteria</p>
            </div>
          ) : (
            assignments.map((assignment) => (
              <div key={assignment.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{assignment.vehicleName}</h3>
                    <p className="text-gray-600 mt-1">{assignment.vehicleNumber}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    assignment.status === 'Parked' 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : assignment.status === 'Retrieving'
                      ? 'bg-orange-50 text-orange-700 border border-orange-200'
                      : 'bg-gray-50 text-gray-700 border border-gray-200'
                  }`}>
                    {assignment.status}
                  </span>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Customer</span>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-900 font-medium">{assignment.customerName}</span>
                      <button 
                        onClick={() => handleCallCustomer(assignment.customerPhone)}
                        className="p-2 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Phone className="w-4 h-4 text-indigo-600" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Valet Assigned</span>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-900 font-medium">{assignment.assignedValet}</span>
                      {assignment.valetId && (
                        <span className="text-xs text-gray-500">ID: {assignment.valetId.slice(0, 4).toUpperCase()}</span>
                      )}
                      <button 
                        onClick={() => handleCallValet(assignment.assignedValet)}
                        className="p-2 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Phone className="w-4 h-4 text-indigo-600" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Location</span>
                    <div className="flex items-center gap-2 text-gray-900 font-medium">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{assignment.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Entry Time</span>
                    <span className="text-gray-900 font-medium">{assignment.entryTime} • {assignment.duration}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Payment</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900 font-medium">₹{assignment.payment}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        assignment.paymentStatus === 'Paid' 
                          ? 'bg-green-50 text-green-700' 
                          : 'bg-orange-50 text-orange-700'
                      }`}>
                        {assignment.paymentStatus}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Ticket</span>
                    <span className="text-gray-900 font-medium">{assignment.ticketId}</span>
                  </div>
                </div>

                <button 
                  onClick={() => handleReassignValet(assignment.id)}
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition-all font-medium"
                >
                  Reassign Valet
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
