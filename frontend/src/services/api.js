const API_BASE_URL = 'http://localhost:3000/api'

const getAuthHeaders = () => {
    const token = localStorage.getItem('token')
    const refreshToken = localStorage.getItem('refreshToken')
    const headers = {
        'Content-Type': 'application/json'
    }
    if (token) {
        headers['Authorization'] = `JWT ${token}`
    }
    if (refreshToken) {
        headers['x-refresh-token'] = refreshToken
    }
    return headers
}

export const api = {
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`
        const config = {
            ...options,
            headers: {
                ...getAuthHeaders(),
                ...options.headers
            }
        }

        try {
            const response = await fetch(url, config)
            const data = await response.json()

            if (response.headers.get('x-access-token')) {
                localStorage.setItem('token', response.headers.get('x-access-token'))
            }
            if (response.headers.get('x-refresh-token')) {
                localStorage.setItem('refreshToken', response.headers.get('x-refresh-token'))
            }

            if (!response.ok) {
                throw new Error(data.message || 'Request failed')
            }

            return data
        } catch (error) {
            throw error
        }
    },

    auth: {
        async signup(userData) {
            return api.request('/auth/signup', {
                method: 'POST',
                body: JSON.stringify(userData)
            })
        },
        async login(credentials) {
            return api.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify(credentials)
            })
        },
        async getMe() {
            return api.request('/auth/me')
        }
    },

    vehicles: {
        async getAll() {
            return api.request('/vehicles/all')
        },
        async add(vehicleData) {
            return api.request('/vehicles/add', {
                method: 'POST',
                body: JSON.stringify(vehicleData)
            })
        },
        async update(vehicleId, vehicleData) {
            return api.request(`/vehicles/update?vehicleId=${vehicleId}`, {
                method: 'PATCH',
                body: JSON.stringify(vehicleData)
            })
        },
        async delete(vehicleId) {
            return api.request(`/vehicles/delete?id=${vehicleId}`, {
                method: 'DELETE'
            })
        }
    },

    users: {
        async updateProfile(profileData) {
            return api.request('/users/profile/update', {
                method: 'PATCH',
                body: JSON.stringify(profileData)
            })
        }
    },

    parking: {
        async start(parkingData) {
            return api.request('/parking/start', {
                method: 'POST',
                body: JSON.stringify(parkingData)
            })
        },
        async end(parkingId) {
            return api.request(`/parking/end?parkingId=${parkingId}`, {
                method: 'PATCH'
            })
        },
        async getActive() {
            return api.request('/parking/active')
        },
        async getHistory() {
            return api.request('/parking/history')
        },
        async getById(parkingId) {
            return api.request(`/parking/details?parkingId=${parkingId}`)
        }
    },

    admin: {
        async getDashboardStats() {
            return api.request('/admin/dashboard')
        },
        async getAllUsers() {
            return api.request('/admin/users')
        },
        async getAllParkings() {
            return api.request('/admin/parkings')
        },
        async getPendingDriverApprovals() {
            return api.request('/admin/pending-drivers')
        },
        async approveDriver(userId) {
            return api.request('/admin/approve-driver', {
                method: 'POST',
                body: JSON.stringify({ userId })
            })
        },
        async rejectDriver(userId) {
            return api.request('/admin/reject-driver', {
                method: 'POST',
                body: JSON.stringify({ userId })
            })
        }
    },

    manager: {
        async getDashboardStats() {
            return api.request('/manager/dashboard')
        },
        async getParkingAssignments(status, search) {
            const params = new URLSearchParams()
            if (status) params.append('status', status)
            if (search) params.append('search', search)
            return api.request(`/manager/assignments?${params.toString()}`)
        },
        async addDriver(driverData) {
            return api.request('/manager/add-driver', {
                method: 'POST',
                body: JSON.stringify(driverData)
            })
        },
        async reassignValet(parkingId, driverId) {
            return api.request('/manager/reassign-valet', {
                method: 'PATCH',
                body: JSON.stringify({ parkingId, driverId })
            })
        },
        async getAvailableDrivers() {
            return api.request('/manager/drivers')
        }
    },

    driver: {
        async getAssignments() {
            return api.request('/driver/assignments')
        },
        async getCurrentAssignment() {
            return api.request('/driver/current')
        },
        async acceptAssignment(parkingId) {
            return api.request('/driver/accept', {
                method: 'POST',
                body: JSON.stringify({ parkingId })
            })
        },
        async rejectAssignment(parkingId) {
            return api.request('/driver/reject', {
                method: 'POST',
                body: JSON.stringify({ parkingId })
            })
        },
        async startTask(parkingId) {
            return api.request('/driver/start', {
                method: 'POST',
                body: JSON.stringify({ parkingId })
            })
        },
        async completeTask(parkingId) {
            return api.request('/driver/complete', {
                method: 'POST',
                body: JSON.stringify({ parkingId })
            })
        },
        async getStats() {
            return api.request('/driver/stats')
        }
    }
}
