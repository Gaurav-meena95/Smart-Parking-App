import React, { useState } from 'react';
import { Bell, CheckCircle, MapPin, Clock, X } from 'lucide-react';
import { mockDriverAssignments } from '../../data/mockData';

export function DriverConsole() {
  const [assignment, setAssignment] = useState(mockDriverAssignments[0]);
  const [hasActiveTask, setHasActiveTask] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  const handleAcceptAssignment = () => {
    setHasActiveTask(true);
    setCurrentTask(assignment);
    alert(`Assignment accepted! Please proceed to ${assignment.location}`);
  };

  const handleRejectAssignment = () => {
    alert('Assignment rejected. Waiting for new assignment...');
    setAssignment(null);
  };

  const handleStartParking = () => {
    if (hasActiveTask) {
      alert('Task completed successfully!');
      setHasActiveTask(false);
      setCurrentTask(null);
    } else {
      alert('No active task to complete');
    }
  };

  const handleNotifications = () => {
    alert('Notifications - Coming Soon!');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white px-8 py-12 rounded-3xl mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold">Driver Console</h1>
              <p className="text-white/90 mt-2 text-lg">Welcome, Raj Malhotra</p>
            </div>
            <button 
              onClick={handleNotifications}
              className="p-3 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Bell className="w-7 h-7" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Assignment */}
          <div className="space-y-8">
            {/* New Assignment Card */}
            {assignment && !hasActiveTask && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">New Assignment</h2>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    assignment.status === 'Retrieve'
                      ? 'bg-orange-50 text-orange-700'
                      : 'bg-green-50 text-green-700'
                  }`}>
                    {assignment.status}
                  </span>
                </div>

                <div className="space-y-6 mb-8">
                  <div>
                    <p className="text-gray-600 mb-2">Vehicle</p>
                    <p className="text-xl font-semibold text-gray-900">{assignment.vehicleName}</p>
                    <p className="text-gray-600">{assignment.vehicleNumber}</p>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-gray-600 mb-2">Customer</p>
                    <p className="text-gray-900 font-medium">{assignment.customerName}</p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-start gap-3">
                    <MapPin className="w-6 h-6 text-gray-400 mt-1" />
                    <div>
                      <p className="text-gray-600 mb-2">Location</p>
                      <p className="text-gray-900 font-medium">{assignment.location} - Slot {assignment.parkingSlot}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-start gap-3">
                    <Clock className="w-6 h-6 text-gray-400 mt-1" />
                    <div>
                      <p className="text-gray-600 mb-2">Assigned Time</p>
                      <p className="text-gray-900 font-medium">{assignment.assignedTime}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={handleRejectAssignment}
                    className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-all font-medium"
                  >
                    <X className="w-5 h-5" />
                    Reject
                  </button>
                  <button 
                    onClick={handleAcceptAssignment}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-500 text-white py-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all font-medium"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Accept
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Current Task */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Current Task</h2>
              
              {hasActiveTask && currentTask ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">Active Task</h3>
                    <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                      In Progress
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-600 mb-2">Vehicle</p>
                      <p className="text-gray-900 font-medium">{currentTask.vehicleName} - {currentTask.vehicleNumber}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-600 mb-2">Customer</p>
                      <p className="text-gray-900 font-medium">{currentTask.customerName}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-600 mb-2">Location</p>
                      <p className="text-gray-900 font-medium">{currentTask.location} - Slot {currentTask.parkingSlot}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-600 mb-2">Task</p>
                      <p className="text-gray-900 font-medium">{currentTask.status} Vehicle</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-6">
                    <MapPin className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-600 text-lg mb-2">No active task</p>
                  <p className="text-gray-500">
                    {assignment ? 'Accept an assignment to start' : 'Waiting for new assignment...'}
                  </p>
                </div>
              )}

              {/* Action Button */}
              <div className="mt-8">
                <button 
                  onClick={handleStartParking}
                  className={`w-full py-4 rounded-xl font-medium transition-all ${
                    hasActiveTask 
                      ? 'bg-gradient-to-r from-green-600 to-green-500 text-white hover:shadow-lg' 
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!hasActiveTask}
                >
                  {hasActiveTask ? 'Complete Task' : 'Start Parking'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}