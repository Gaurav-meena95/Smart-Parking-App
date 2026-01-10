import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, MapPin, Clock, X, Loader2 } from 'lucide-react';
import { api } from '../../../services/api';

export function DriverConsole() {
  const [assignments, setAssignments] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [stats, setStats] = useState({ today: { parked: 0, retrieved: 0 }, newAssignments: 0 });
  const [driverName, setDriverName] = useState('Driver');
  const [loading, setLoading] = useState(true);
  const [taskInProgress, setTaskInProgress] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🚀 Starting fetchData...');

      // Check if user is logged in
      const token = localStorage.getItem('token');
      console.log('Token exists:', !!token);

      // Fetch driver info
      const userResponse = await api.auth.getMe();
      console.log('User Response:', userResponse);
      if (userResponse && userResponse.name) {
        setDriverName(userResponse.name);
        console.log('Driver name set:', userResponse.name);
      }

      // Fetch assignments, current task, and stats in parallel
      console.log('🔄 Fetching driver data...');
      
      const assignmentsResponse = await api.driver.getAssignments();
      console.log('Assignments Response:', assignmentsResponse);
      
      const currentResponse = await api.driver.getCurrentAssignment();
      console.log('Current Response:', currentResponse);
      
      const statsResponse = await api.driver.getStats();
      console.log('Stats Response:', statsResponse);

      if (assignmentsResponse && assignmentsResponse.success) {
        console.log('Setting assignments:', assignmentsResponse.data);
        setAssignments(assignmentsResponse.data || []);
      } else {
        console.log('❌ Assignments response failed or no success flag');
      }

      if (currentResponse && currentResponse.success && currentResponse.data) {
        console.log('Setting current task:', currentResponse.data);
        setCurrentTask(currentResponse.data);
      } else {
        console.log('ℹ️ No current task');
      }

      if (statsResponse && statsResponse.success) {
        console.log('Setting stats:', statsResponse.data);
        setStats(statsResponse.data);
      } else {
        console.log('❌ Stats response failed or no success flag');
      }

      console.log('✅ fetchData completed');
    } catch (err) {
      console.error('❌ Error fetching data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptAssignment = async (assignment) => {
    try {
      setError(null);
      const response = await api.driver.acceptAssignment(assignment.id);

      if (response.success) {
        // Remove from assignments list
        setAssignments(prev => prev.filter(a => a.id !== assignment.id));
        // Set as current task
        setCurrentTask(response.data);
        // Update stats
        await fetchStats();
      }
    } catch (err) {
      console.error('Error accepting assignment:', err);
      setError(err.message || 'Failed to accept assignment');
    }
  };

  const handleRejectAssignment = async (assignment) => {
    try {
      setError(null);
      const response = await api.driver.rejectAssignment(assignment.id);

      if (response.success) {
        // Remove from assignments list
        setAssignments(prev => prev.filter(a => a.id !== assignment.id));
        // Update stats
        await fetchStats();
      }
    } catch (err) {
      console.error('Error rejecting assignment:', err);
      setError(err.message || 'Failed to reject assignment');
    }
  };

  const handleStartTask = async () => {
    if (!currentTask) return;

    try {
      setError(null);
      setTaskInProgress(true);

      const response = await api.driver.startTask(currentTask.id);

      if (response.success) {
        // Show in-progress state
        // Task already started, just update UI state
      }
    } catch (err) {
      console.error('Error starting task:', err);
      setError(err.message || 'Failed to start task');
      setTaskInProgress(false);
    }
  };

  const handleCompleteTask = async () => {
    if (!currentTask) return;

    try {
      setError(null);
      const response = await api.driver.completeTask(currentTask.id);

      if (response.success) {
        // Clear current task
        setCurrentTask(null);
        setTaskInProgress(false);
        // Refresh data
        await fetchData();
      }
    } catch (err) {
      console.error('Error completing task:', err);
      setError(err.message || 'Failed to complete task');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.driver.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleNotifications = () => {
    alert('Notifications - Coming Soon!');
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white px-8 py-12 rounded-3xl mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold">Driver Console</h1>
              <p className="text-white/90 mt-2 text-lg">Welcome back, {driverName}</p>
            </div>
            <button
              onClick={handleNotifications}
              className="p-3 hover:bg-white/10 rounded-lg transition-colors relative"
            >
              <Bell className="w-7 h-7" />
              {stats.newAssignments > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                  {stats.newAssignments}
                </span>
              )}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <p className="text-white/80 text-sm mb-1">New Assignments</p>
              <p className="text-3xl font-bold">{stats.newAssignments}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <p className="text-white/80 text-sm mb-1">Parked</p>
              <p className="text-3xl font-bold">{stats.today.parked}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <p className="text-white/80 text-sm mb-1">Retrieved</p>
              <p className="text-3xl font-bold">{stats.today.retrieved}</p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6">
            <p className="font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - New Assignments */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">New Assignments</h2>

            {assignments.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                  <CheckCircle className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-600">No new assignments</p>
                <p className="text-gray-500 text-sm mt-1">You're all caught up!</p>
              </div>
            ) : (
              assignments.map((assignment) => (
                <div key={assignment.id} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Assignment</h3>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${assignment.taskType === 'RETRIEVE'
                        ? 'bg-orange-50 text-orange-700'
                        : 'bg-green-50 text-green-700'
                      }`}>
                      {assignment.taskType === 'RETRIEVE' ? 'Retrieve Vehicle' : 'Park Vehicle'}
                    </span>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="text-gray-600 mb-1 text-sm">Vehicle</p>
                      <p className="text-lg font-semibold text-gray-900">{assignment.vehicle.vehicleName}</p>
                      <p className="text-gray-600">{assignment.vehicle.vehicleNumber}</p>
                    </div>

                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-gray-600 mb-1 text-sm">Customer</p>
                      <p className="text-gray-900 font-medium">{assignment.user.name}</p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-gray-600 mb-1 text-sm">Location</p>
                        <p className="text-gray-900 font-medium">{assignment.location}</p>
                        <p className="text-gray-600 text-sm">{assignment.address}</p>
                        {assignment.parkingSlot && (
                          <p className="text-indigo-600 font-medium mt-1">
                            {assignment.taskType === 'RETRIEVE' ? 'Retrieve from' : 'Park at'}: {assignment.parkingSlot}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-start gap-3">
                      <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-gray-600 mb-1 text-sm">Assigned at</p>
                        <p className="text-gray-900 font-medium">{formatTime(assignment.assignedAt)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleRejectAssignment(assignment)}
                      className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-all font-medium"
                    >
                      <X className="w-5 h-5" />
                      Reject
                    </button>
                    <button
                      onClick={() => handleAcceptAssignment(assignment)}
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all font-medium"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Accept Assignment
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right Column - Current Task */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Current Assignment</h2>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              {currentTask ? (
                taskInProgress ? (
                  // Task in progress state
                  <div className="text-center py-8">
                    <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto flex items-center justify-center mb-6 animate-pulse">
                      <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {currentTask.taskType === 'PARK' ? 'Parking' : 'Retrieval'} in Progress...
                    </h3>
                    <p className="text-lg text-gray-900 font-medium mb-1">{currentTask.vehicle.vehicleName}</p>
                    <p className="text-gray-600 mb-6">{currentTask.vehicle.vehicleNumber}</p>

                    <button
                      onClick={handleCompleteTask}
                      className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-4 rounded-xl font-medium hover:shadow-lg transition-all"
                    >
                      Complete Task
                    </button>
                  </div>
                ) : (
                  // Task accepted, ready to start
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-900">Active Task</h3>
                      <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                        Ready to Start
                      </span>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div>
                        <p className="text-gray-600 mb-1 text-sm">Task Type</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {currentTask.taskType === 'RETRIEVE' ? 'Retrieve Vehicle' : 'Park Vehicle'}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-gray-100">
                        <p className="text-gray-600 mb-1 text-sm">Vehicle</p>
                        <p className="text-gray-900 font-medium">{currentTask.vehicle.vehicleName}</p>
                        <p className="text-gray-600">{currentTask.vehicle.vehicleNumber}</p>
                      </div>

                      <div className="pt-3 border-t border-gray-100">
                        <p className="text-gray-600 mb-1 text-sm">Customer</p>
                        <p className="text-gray-900 font-medium">{currentTask.user.name}</p>
                      </div>

                      <div className="pt-3 border-t border-gray-100">
                        <p className="text-gray-600 mb-1 text-sm">Location</p>
                        <p className="text-gray-900 font-medium">{currentTask.location}</p>
                        <p className="text-gray-600 text-sm">{currentTask.address}</p>
                        {currentTask.parkingSlot && (
                          <p className="text-indigo-600 font-medium mt-1">
                            {currentTask.taskType === 'RETRIEVE' ? 'Retrieve from' : 'Park at'}: {currentTask.parkingSlot}
                          </p>
                        )}
                      </div>

                      <div className="pt-3 border-t border-gray-100">
                        <p className="text-gray-600 mb-1 text-sm">Assigned at</p>
                        <p className="text-gray-900 font-medium">{formatTime(currentTask.assignedAt)}</p>
                      </div>
                    </div>

                    <button
                      onClick={handleStartTask}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-medium hover:shadow-lg transition-all"
                    >
                      {currentTask.taskType === 'PARK' ? 'Start Parking' : 'Start Retrieval'}
                    </button>
                  </div>
                )
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-6">
                    <MapPin className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-600 text-lg mb-2">No active task</p>
                  <p className="text-gray-500">
                    {assignments.length > 0 ? 'Accept an assignment to start' : 'Waiting for new assignment...'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}