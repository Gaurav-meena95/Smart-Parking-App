import React, { createContext, useState, useContext, useEffect } from 'react'
import { api } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            fetchUser()
        } else {
            setLoading(false)
        }
    }, [])

    const fetchUser = async () => {
        try {
            const data = await api.auth.getMe()
            setUser(data)
            setIsAuthenticated(true)
        } catch (error) {
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
            setUser(null)
            setIsAuthenticated(false)
        } finally {
            setLoading(false)
        }
    }

    const login = async (email, password, role) => {
        try {
            const data = await api.auth.login({ email, password, role })
            if (data.token) {
                localStorage.setItem('token', data.token)
                localStorage.setItem('refreshToken', data.refreshToken)
                setUser(data.user)
                setIsAuthenticated(true)
                return { success: true, data }
            }
            throw new Error('Login failed')
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const signup = async (name, email, password, role) => {
        try {
            const data = await api.auth.signup({ name, email, password, role })
            return { success: true, data }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        setUser(null)
        setIsAuthenticated(false)
    }

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isAuthenticated,
            login,
            signup,
            logout,
            fetchUser
        }}>
            {children}
        </AuthContext.Provider>
    )
}
