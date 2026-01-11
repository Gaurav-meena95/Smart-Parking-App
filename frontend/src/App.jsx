import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Landing } from './components/pages/auth/Landing'
import { Login } from './components/pages/auth/Login'
import { Signup } from './components/pages/auth/Signup'
import { UserHome } from './components/pages/user/Home'
import { QRScanner } from './components/pages/user/QRScanner'
import { VehicleSelection } from './components/pages/user/VehicleSelection'
import { AddVehicle } from './components/pages/user/AddVehicle'
import { Confirmparking } from './components/pages/user/parkingConfirm'
import { UserTicket } from './components/pages/user/Ticket'
import { UserHistory } from './components/pages/user/History'
import { UserSettings } from './components/pages/user/Setting'
import { ManageVehicles } from './components/pages/user/ManageVehicles'
import { FAQ } from './components/pages/user/FAQ'
import { HelpSupport } from './components/pages/user/HelpSupport'
import { AdminDashboard } from './components/pages/admin/Dashboard'
import { ManagerDashboard } from './components/pages/manager/Dashboard'
import { AddDriver } from './components/pages/manager/AddDriver'
import { DriverConsole } from './components/pages/driver/Console'
import { BottomNav } from './components/BottomNav'

function ProtectedRoute({ children, showBottomNav = true }) {
    const token = localStorage.getItem('token')
    if (!token) {
        return <Navigate to="/login" replace />
    }
    return (
        <>
            {children}
            {showBottomNav && <BottomNav />}
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
                    <Route path="/vehicle-selection" element={<ProtectedRoute><VehicleSelection /></ProtectedRoute>} />
                    <Route path="/add-vehicle" element={<ProtectedRoute><AddVehicle /></ProtectedRoute>} />
                    <Route path="/confirm-parking" element={<ProtectedRoute><Confirmparking /></ProtectedRoute>} />
                    <Route path="/ticket" element={<ProtectedRoute><UserTicket /></ProtectedRoute>} />
                    <Route path="/history" element={<ProtectedRoute><UserHistory /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute><UserSettings /></ProtectedRoute>} />
                    <Route path="/manage-vehicles" element={<ProtectedRoute><ManageVehicles /></ProtectedRoute>} />
                    <Route path="/faq" element={<ProtectedRoute><FAQ /></ProtectedRoute>} />
                    <Route path="/help-support" element={<ProtectedRoute><HelpSupport /></ProtectedRoute>} />
                    <Route path="/admin" element={<ProtectedRoute showBottomNav={false}><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/manager" element={<ProtectedRoute showBottomNav={false}><ManagerDashboard /></ProtectedRoute>} />
                    <Route path="/manager/add-driver" element={<ProtectedRoute showBottomNav={false}><AddDriver /></ProtectedRoute>} />
                    <Route path="/driver" element={<ProtectedRoute showBottomNav={false}><DriverConsole /></ProtectedRoute>} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}