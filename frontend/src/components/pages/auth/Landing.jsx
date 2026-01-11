import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Car, Shield, Clock, MapPin, Users, Star, ArrowRight, CheckCircle } from 'lucide-react'

export function Landing() {
  const navigate = useNavigate()

  const handleGetStarted = () => {
    navigate('/login')
  }

  const handleLearnMore = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
  }

  const features = [
    {
      icon: Car,
      title: 'Smart parking',
      description: 'AI-powered parking solutions that optimize space utilization and reduce wait times.'
    },
    {
      icon: Shield,
      title: 'Secure & Safe',
      description: 'Advanced security systems with 24/7 monitoring and insurance coverage.'
    },
    {
      icon: Clock,
      title: 'Real-time Updates',
      description: 'Live parking availability and instant notifications for seamless experience.'
    },
    {
      icon: MapPin,
      title: 'Multiple Locations',
      description: 'Network of premium parking locations across major cities and commercial areas.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Car className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              <div>
                <h1 className="text-lg lg:text-2xl font-bold text-gray-900">Smart parking</h1>
                <p className="text-sm text-gray-600 hidden lg:block">Intelligent parking Solutions</p>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-8">
              <button 
                onClick={handleLearnMore}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Features
              </button>
              <a href="#contact" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Contact
              </a>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/login')}
                className="text-gray-600 hover:text-gray-900 text-xs lg:text-sm font-medium transition-colors"
              >
                Sign In
              </button>
              <button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white  text-xs lg:text-sm px-3 py-2 rounded-lg hover:shadow-lg transition-all font-medium"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Smart parking
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent block">
                    Made Simple
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Experience the future of parking with our intelligent system. Find, book, and manage parking spaces effortlessly with real-time updates and seamless valet services.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all font-medium text-lg flex items-center justify-center gap-2"
                >
                  Get Started Today
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleLearnMore}
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all font-medium text-lg"
                >
                  Learn More
                </button>
              </div>

              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">50K+</p>
                  <p className="text-gray-600">Happy Users</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">200+</p>
                  <p className="text-gray-600">Locations</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">99.9%</p>
                  <p className="text-gray-600">Uptime</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl p-8 lg:p-12">
                <div className="grid lg:grid-cols-2 grid-cols-(2,auto) gap-6">
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <Car className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">parking Found</p>
                        <p className="text-sm text-gray-600">Slot A-23</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">Available Now</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">2 min walk</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Valet Service</p>
                        <p className="text-sm text-gray-600">On the way</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-orange-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">ETA: 3 mins</span>
                      </div>
                      <div className="flex items-center gap-2 text-purple-600">
                        <Shield className="w-4 h-4" />
                        <span className="text-sm">Insured</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
              Why Choose Smart parking?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive parking solution combines cutting-edge technology with exceptional service to deliver an unmatched experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-32 bg-gradient-to-r from-indigo-600 to-purple-900">
        <div className="max-w-4xl mx-auto text-center px-6 lg:px-8">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your parking Experience?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join Smart parking today and never worry about finding parking again.
          </p>
          <button 
            onClick={handleGetStarted}
            className="bg-white text-indigo-700 px-8 py-4 rounded-xl hover:shadow-lg transition-all font-medium text-lg inline-flex items-center gap-2"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-900 rounded-xl flex items-center justify-center">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Smart parking</h3>
                  <p className="text-gray-400">Intelligent parking Solutions</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                Revolutionizing urban mobility with smart parking solutions that save time, reduce stress, and optimize city infrastructure.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><button onClick={() => navigate('/login')} className="hover:text-white transition-colors">Sign In</button></li>
                <li><button onClick={handleGetStarted} className="hover:text-white transition-colors">Get Started</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>support@smartparking.com</li>
                <li>+91 98765 43210</li>
                <li>Mumbai, India</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Smart parking. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}