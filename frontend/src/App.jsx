import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Landing } from './components/pages/auth/Landing'
import { Login } from './components/pages/auth/Login'
import { Signup } from './components/pages/auth/Signup'
import { UserHome } from './components/pages/user/Home'
import { QRScanner } from './components/pages/user/QRScanner'
import { ConfirmParking } from './components/pages/user/ParkingConfirm'
import { UserTicket } from './components/pages/user/Ticket'
import { UserHistory } from './components/pages/user/History'
import { UserSettings } from './components/pages/user/Setting'
import { BottomNav } from './components/BottomNav'

function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token')
    if (!token) {
        return <Navigate to="/login" replace />
    }
    return (
        <>
            {children}
            <BottomNav />
        </>
    )
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/landing" replace />} />
                    <Route path="/landing" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/home" element={<ProtectedRoute><UserHome /></ProtectedRoute>} />
                    <Route path="/qr-scanner" element={<ProtectedRoute><QRScanner /></ProtectedRoute>} />
                    <Route path="/confirm-parking" element={<ProtectedRoute><ConfirmParking /></ProtectedRoute>} />
                    <Route path="/ticket" element={<ProtectedRoute><UserTicket /></ProtectedRoute>} />
                    <Route path="/history" element={<ProtectedRoute><UserHistory /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute><UserSettings /></ProtectedRoute>} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}