import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, MessageCircle } from 'lucide-react'

export function HelpSupport() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-8">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-8">
          <button
            onClick={() => navigate('/settings')}
            className=" absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Settings
          </button>
          <div className='bg-linear-to-r from-indigo-600  to-purple-800 mt-6  mb-8 lg:mb-12 rounded-2xl'>
            <div className='p-5'>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Help & Support</h1>
              <p className="text-lg text-gray-300/70">Get assistance with your account and preferences</p>

            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <button
            onClick={() => navigate('/faq')}
            className="w-full bg-white rounded-lg p-6 shadow border border-gray-200 hover:shadow-md transition-all text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">FAQ</h3>
                <p className="text-gray-600">Frequently Asked Questions</p>
              </div>
            </div>
          </button>
        </div>

        <div className="bg-white rounded-lg p-6 shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Us</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-indigo-600" />
                <div>
                  <span className="font-medium text-gray-900 block">Email Us</span>
                  <span className="text-sm text-gray-600">support@smartparking.com</span>
                </div>
              </div>
            </button>
            <button className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-indigo-600" />
                <div>
                  <span className="font-medium text-gray-900 block">Call Us</span>
                  <span className="text-sm text-gray-600">+91 98765 43210</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
