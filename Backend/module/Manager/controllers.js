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

        const todayparkings = await prisma.parking.findMany({
            where: {
                entryTime: {
                    gte: today,
                    lt: tomorrow
                }
            }
        })

        const activeparkings = await prisma.parking.findMany({
            where: {
                status: 'active'
            },
            include: {
                vehicle: true,
                user: true
            }
        })

        const retrievingparkings = await prisma.parking.findMany({
            where: {
                status: 'active',
                assignedDriverId: null
            }
        })

        const todayRevenue = todayparkings.reduce((sum, p) => sum + (p.totalAmount || 0), 0)

        const activeCars = activeparkings.length
        const retrieving = retrievingparkings.length
        const totalToday = todayparkings.length
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

const getparkingAssignments = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'manager') {
            return res.status(403).json({ message: 'Manager access required' })
        }

        const { status, search } = req.query

        let whereClause = {}
        
        if (status && status !== 'All') {
            if (status === 'parked') {
                whereClause.status = 'in_progress'
            } else if (status === 'Retrieving') {
                whereClause.status = 'pending'
                whereClause.taskType = 'retrive'
            } else if (status === 'Retrieved') {
                whereClause.status = 'completed'
            }
        } else {
            whereClause.status = { in: ['pending', 'in_progress'] }
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

        let filteredparkings = parkings

        if (search) {
            const searchLower = search.toLowerCase()
            filteredparkings = parkings.filter(p => 
                p.vehicle.vehicleNumber.toLowerCase().includes(searchLower) ||
                p.user.name.toLowerCase().includes(searchLower) ||
                (p.assignedDriver && p.assignedDriver.name.toLowerCase().includes(searchLower))
            )
        }

        const assignments = filteredparkings.map(p => {
            const entryTime = new Date(p.entryTime)
            const now = new Date()
            const durationMs = now - entryTime
            const hours = Math.floor(durationMs / (1000 * 60 * 60))
            const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))
            const duration = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`

            let status = 'Pending Assignment'
            if (p.status === 'completed') {
                status = 'Retrieved'
            } else if (p.status === 'in_progress') {
                status = 'In Progress'
            } else if (p.status === 'pending' && p.assignedDriverId) {
                status = 'Assigned'
            }

            return {
                id: p.id,
                ticketId: p.ticketId,
                vehicleName: p.vehicle.vehicleName,
                vehicleNumber: p.vehicle.vehicleNumber,
                customerName: p.user.name,
                customerPhone: p.user.phone || 'N/A',
                assignedValet: p.assignedDriver ? p.assignedDriver.name : 'Unassigned',
                valetId: p.assignedDriver ? p.assignedDriver.id : null,
                location: p.location,
                address: p.address,
                taskType: p.taskType || 'park',
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
                phone: phone,
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
                phone: newDriver.phone
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
            return res.status(404).json({ message: 'parking not found' })
        }

        const driver = await prisma.user.findUnique({
            where: { id: driverId }
        })

        if (!driver || driver.role !== 'driver') {
            return res.status(404).json({ message: 'Driver not found' })
        }

        const updatedparking = await prisma.parking.update({
            where: { id: parkingId },
            data: {
                assignedDriverId: driverId,
                assignedAt: new Date()
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
            message: 'Driver assigned successfully',
            parking: updatedparking
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
                phone: true
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
    getparkingAssignments,
    addDriver,
    reassignValet,
    getAvailableDrivers
}
