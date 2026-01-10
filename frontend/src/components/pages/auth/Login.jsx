import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Car, Eye, EyeOff, ArrowLeft, User, Shield, Truck, Settings } from 'lucide-react'
import { api } from '../../../services/api'

export function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('user');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const roles = [
    {
      id: 'user',
      name: 'User',
      description: 'Find and book parking spaces',
      icon: User,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      Demo_Credentials: {
        email: 'user@demo.com',
        password: 'User@123'
      }
    },
    {
      id: 'driver',
      name: 'Valet Driver',
      description: 'Manage parking assignments',
      icon: Truck,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      Demo_Credentials: {
        email: 'driver@demo.com',
        password: 'Driver@123'
      }
    },
    {
      id: 'manager',
      name: 'Manager',
      description: 'Oversee operations and staff',
      icon: Shield,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      Demo_Credentials: {
        email: 'manager@demo.com',
        password: 'Manager@123'
      }
    },
    {
      id: 'admin',
      name: 'Admin',
      description: 'System administration',
      icon: Settings,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      Demo_Credentials: {
        email: 'admin@demo.com',
        password: 'Admin@123'
      }
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const result = await api.auth.login({
        email: formData.email,
        password: formData.password,
        role: selectedRole
      })

      if (result.token) {
        localStorage.setItem('token', result.token)
        localStorage.setItem('refreshToken', result.refreshToken)
        localStorage.setItem('user', JSON.stringify(result.user))

        if (result.user.role === 'admin') {
          navigate('/admin')
        } else if (result.user.role === 'manager') {
          navigate('/manager')
        } else if (result.user.role === 'driver') {
          navigate('/driver')
        } else {
          navigate('/home')
        }
      }
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    navigate('/landing');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100">
      <div className="min-h-screen flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full rounded-2xl p-5 shadow-xl border border-gray-100">
          <button
            onClick={handleBack}
            className=" absolute top-6 left-6  flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-8 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>


          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Car className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Smart Parking</h1>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your account to continue</p>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${selectedRole === role.id
                      ? `border-indigo-600 ${role.bgColor}`
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedRole === role.id ? role.bgColor : 'bg-gray-100'
                        }`}>
                        <Icon className={`w-5 h-5 ${selectedRole === role.id ? role.textColor : 'text-gray-600'
                          }`} />
                      </div>
                      <div>
                        <p className={`font-medium ${selectedRole === role.id ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                          {role.name}
                        </p>
                        <p className="text-xs text-gray-500">{role.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    required
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <span className="ml-2 text-sm text-gray-600">Don't know password </span>
                </label>
                <button
                  type="button"
                  className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : `Sign In as ${roles.find(r => r.id === selectedRole)?.name}`}
              </button>
            </div>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
              >
                Sign up here
              </Link>
            </p>
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-xl">
            <p className=" font-medium text-gray-700 mb-2">Demo Credentials: {selectedRole}</p>
            {
              roles.map((ele) => (
                ele.id == selectedRole ? (
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Email: {ele.Demo_Credentials.email}</p>
                    <p>Password: {ele.Demo_Credentials.password}</p>
                    <p className="text-gray-500 mt-2">Use any role to explore the system</p>
                  </div>
                ) : ('')
              ))
            }

          </div>
        </div>
      </div>
    </div>
  );
}