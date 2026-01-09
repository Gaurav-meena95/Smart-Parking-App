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
    }
}
