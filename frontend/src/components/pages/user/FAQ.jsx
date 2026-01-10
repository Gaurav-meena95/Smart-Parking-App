import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, HelpCircle } from 'lucide-react'

export function FAQ() {
  const navigate = useNavigate()

  const faqs = [
    {
      question: 'How do I add a vehicle?',
      answer: 'Go to the "Manage Vehicles" section and click "Add New Vehicle". Fill in the vehicle details and save.'
    },
    {
      question: 'How do I remove a vehicle?',
      answer: 'Go to the "Manage Vehicles" section and click "Remove" next to the vehicle you want to delete.'
    },
    {
      question: 'How do I manage payment methods?',
      answer: 'Payment methods are selected during parking confirmation. You can choose from UPI, Netbanking, Credit/Debit Card, or Cash.'
    },
    {
      question: 'How do I view transaction history?',
      answer: 'Go to the "Transaction History" section in Settings or visit the History page to view all your parking transactions.'
    },
    {
      question: 'Can I edit my vehicle details?',
      answer: 'Yes, you can edit vehicle name and owner name from the Manage Vehicles section. Vehicle number cannot be changed once registered.'
    },
    {
      question: 'How do I end a parking session?',
      answer: 'Go to the Ticket page and click "Get My Car" button to end your active parking session.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-8">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-8">
          <button
            onClick={() => navigate('/settings')}
            className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Settings
          </button>
          <div className='bg-linear-to-r from-indigo-600  to-purple-800 mt-6  mb-8 lg:mb-12 rounded-2xl'>
            <div className='p-5'> 
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">FAQ</h1>
              <p className="text-lg text-gray-300/70">Frequently Asked Questions</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-lg p-6 shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Still have questions?</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="font-medium text-gray-900">Email Us</span>
              <p className="text-sm text-gray-600 mt-1">support@smartparking.com</p>
            </button>
            <button className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="font-medium text-gray-900">Call Us</span>
              <p className="text-sm text-gray-600 mt-1">+91 98765 43210</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
