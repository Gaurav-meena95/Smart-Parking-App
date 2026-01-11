import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../Header';
import { Camera, Upload } from 'lucide-react';
import { api } from '../../../services/api';

export function AddDriver() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    dateOfBirth: '',
    licenseNumber: '',
    licenseExpiry: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = () => {
    alert('Photo upload functionality - Coming Soon!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phone || !formData.email) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await api.manager.addDriver({
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address || '',
        dateOfBirth: formData.dateOfBirth || null,
        licenseNumber: formData.licenseNumber || '',
        licenseExpiry: formData.licenseExpiry || null
      });

      alert(`Driver ${formData.fullName} added successfully!`);
      navigate('/manager');
    } catch (error) {
      console.error('Error adding driver:', error);
      alert(error.message || 'Failed to add driver');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/manager');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8">
        <Header
          title="Add Driver / Valet"
          showBack={true}
          onBack={handleBack}
        />

        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-8 lg:p-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">Fill in the details to add a new driver</h2>

            <form onSubmit={handleSubmit}>
              <div className="flex justify-center mb-12">
                <div className="relative">
                  <div className="w-40 h-40 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Camera className="w-16 h-16 text-indigo-600" />
                  </div>
                  <button
                    type="button"
                    onClick={handlePhotoUpload}
                    className="absolute bottom-2 right-2 w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-indigo-700 transition-all"
                  >
                    <Upload className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Personal Details</h3>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter full name"
                      required
                      className="w-full px-4 py-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">Phone Number *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '')
                        if (value.length <= 10) {
                          setFormData({ ...formData, phone: value })
                        }
                      }}
                      name="phone"
                      placeholder="+91 xxxxx xxxxx"
                      required
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="driver@example.com"
                      required
                      className="w-full px-4 py-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Enter address"
                      className="w-full px-4 py-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">Date of Birth</label>
                    <input
                    type='date'
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">License Details</h3>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">Driving License Number *</label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      placeholder="DL-1420110012345"
                      required
                      className="w-full px-4 py-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">License Expiry Date</label>
                    <input
                      type="date"
                      name="licenseExpiry"
                      value={formData.licenseExpiry}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">License Photo *</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <button
                        type="button"
                        onClick={handlePhotoUpload}
                        className="text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        Upload License Photo
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6 mt-8">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h4>
                    <div className="space-y-4 text-sm text-gray-600">
                      <p>• Driver will receive login credentials via email</p>
                      <p>• Background verification will be conducted</p>
                      <p>• Training session will be scheduled</p>
                      <p>• All documents will be verified before activation</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 flex gap-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 lg:flex-none lg:px-8 bg-gray-100 text-gray-700 py-4 rounded-xl hover:bg-gray-200 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 lg:flex-none lg:px-8 bg-indigo-600 text-white py-4 rounded-xl hover:bg-indigo-700 transition-all font-medium disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit for Approval'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
