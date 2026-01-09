const { prisma } = require('../../DB/config')
const { validationInput } = require('../../utils/utils')
const bcrypt = require('bcrypt')

const getDashboardStats = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'manager') {
            return res.status(403).json({ message: 'Manager access required' })
        }

        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        const todayParkings = await prisma.parking.findMany({
            where: {
                entryTime: {
                    gte: today,
                    lt: tomorrow
                }
            }
        })

        const activeParkings = await prisma.parking.findMany({
            where: {
                status: 'active'
            },
            include: {
                vehicle: true,
                user: true
            }
        })

        const retrievingParkings = await prisma.parking.findMany({
            where: {
                status: 'active',
                assignedDriverId: null
            }
        })

        const todayRevenue = todayParkings.reduce((sum, p) => sum + (p.totalAmount || 0), 0)

        const activeCars = activeParkings.length
        const retrieving = retrievingParkings.length
        const totalToday = todayParkings.length
        const revenue = todayRevenue

        return res.status(200).json({
            activeCars,
            retrieving,
            totalToday,
            revenue
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

const getParkingAssignments = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'manager') {
            return res.status(403).json({ message: 'Manager access required' })
        }

        const { status, search } = req.query

        let whereClause = {}
        
        if (status && status !== 'All') {
            if (status === 'Parked') {
                whereClause.status = 'active'
            } else if (status === 'Retrieving') {
                whereClause.status = 'active'
            } else if (status === 'Retrieved') {
                whereClause.status = 'completed'
            }
        }

        const parkings = await prisma.parking.findMany({
            where: whereClause,
            include: {
                vehicle: true,
                user: true,
                assignedDriver: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: {
                entryTime: 'desc'
            }
        })

        let filteredParkings = parkings

        if (search) {
            const searchLower = search.toLowerCase()
            filteredParkings = parkings.filter(p => 
                p.vehicle.vehicleNumber.toLowerCase().includes(searchLower) ||
                p.user.name.toLowerCase().includes(searchLower) ||
                (p.assignedDriver && p.assignedDriver.name.toLowerCase().includes(searchLower))
            )
        }

        const assignments = filteredParkings.map(p => {
            const entryTime = new Date(p.entryTime)
            const now = new Date()
            const durationMs = now - entryTime
            const hours = Math.floor(durationMs / (1000 * 60 * 60))
            const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))
            const duration = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`

            let status = 'Parked'
            if (p.status === 'completed') {
                status = 'Retrieved'
            } else if (!p.assignedDriverId) {
                status = 'Retrieving'
            }

            return {
                id: p.id,
                ticketId: p.ticketId,
                vehicleName: p.vehicle.vehicleName,
                vehicleNumber: p.vehicle.vehicleNumber,
                customerName: p.user.name,
                customerPhone: p.user.mobile || 'N/A',
                assignedValet: p.assignedDriver ? p.assignedDriver.name : 'Unassigned',
                valetId: p.assignedDriver ? p.assignedDriver.id : null,
                location: p.location,
                address: p.address,
                entryTime: entryTime.toLocaleString('en-IN', { 
                    day: 'numeric', 
                    month: 'short', 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                }),
                duration,
                payment: p.totalAmount,
                paymentStatus: p.paymentMethod === 'Cash' ? 'Pending' : 'Paid',
                status
            }
        })

        return res.status(200).json({ assignments })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

const addDriver = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'manager') {
            return res.status(403).json({ message: 'Manager access required' })
        }

        const { fullName, phone, email, address, dateOfBirth, licenseNumber, licenseExpiry } = req.body
        
        const value = validationInput({ fullName, phone, email })
        if (value) {
            return res.status(400).json({ message: `Missing field: ${value}` })
        }

        const existing = await prisma.user.findUnique({ 
            where: { email } 
        })

        if (existing) {
            return res.status(400).json({ message: 'Email already exists' })
        }

        const defaultPassword = 'Driver@123'
        const hashedPassword = await bcrypt.hash(defaultPassword, 10)

        const newDriver = await prisma.user.create({
            data: {
                name: fullName,
                email,
                password: hashedPassword,
                mobile: phone,
                role: 'driver',
                approvalStatus: 'pending'
            }
        })

        return res.status(201).json({
            message: 'Driver added successfully',
            driver: {
                id: newDriver.id,
                name: newDriver.name,
                email: newDriver.email,
                mobile: newDriver.mobile
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

const reassignValet = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'manager') {
            return res.status(403).json({ message: 'Manager access required' })
        }

        const { parkingId, driverId } = req.body
        
        const value = validationInput({ parkingId, driverId })
        if (value) {
            return res.status(400).json({ message: `Missing field: ${value}` })
        }

        const parking = await prisma.parking.findUnique({
            where: { id: parkingId }
        })

        if (!parking) {
            return res.status(404).json({ message: 'Parking not found' })
        }

        const driver = await prisma.user.findUnique({
            where: { id: driverId }
        })

        if (!driver || driver.role !== 'driver') {
            return res.status(404).json({ message: 'Driver not found' })
        }

        const updatedParking = await prisma.parking.update({
            where: { id: parkingId },
            data: {
                assignedDriverId: driverId
            },
            include: {
                assignedDriver: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })

        return res.status(200).json({
            message: 'Valet reassigned successfully',
            parking: updatedParking
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

const getAvailableDrivers = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'manager') {
            return res.status(403).json({ message: 'Manager access required' })
        }

        const drivers = await prisma.user.findMany({
            where: {
                role: 'driver',
                approvalStatus: 'approved'
            },
            select: {
                id: true,
                name: true,
                email: true,
                mobile: true
            }
        })

        return res.status(200).json({ drivers })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

module.exports = {
    getDashboardStats,
    getParkingAssignments,
    addDriver,
    reassignValet,
    getAvailableDrivers
}
