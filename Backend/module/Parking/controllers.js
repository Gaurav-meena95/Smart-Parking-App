const { prisma } = require('../../DB/config')
const { validationInput } = require('../../utils/utils')

const generateTicketId = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `TK-${year}-${month}-${day}-${hours}${minutes}`
}

const startparking = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const { vehicleId, location, address, paymentMethod } = req.body
        const value = validationInput({ vehicleId, location, address, paymentMethod })
        if (value) {
            return res.status(400).json({ message: `Missing field: ${value}` })
        }

        const vehicle = await prisma.vehicle.findFirst({
            where: {
                id: vehicleId,
                ownerId: req.user.id,
                isActive: true
            }
        })

        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' })
        }

        const activeparking = await prisma.parking.findFirst({
            where: {
                userId: req.user.id,
                vehicleId: vehicleId,
                status: 'active'
            }
        })

        if (activeparking) {
            return res.status(400).json({ message: 'Vehicle already has an active parking session' })
        }

        const baseRate = 100
        const serviceFee = 30
        const gst = 20
        const totalAmount = baseRate + serviceFee + gst

        const parking = await prisma.parking.create({
            data: {
                ticketId: generateTicketId(),
                userId: req.user.id,
                vehicleId: vehicleId,
                location,
                address,
                entryTime: new Date(),
                baseRate,
                serviceFee,
                gst,
                totalAmount,
                paymentMethod,
                status: 'pending'
            },
            include: {
                vehicle: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true
                    }
                }
            }
        })

        res.status(201).json({
            message: 'parking started successfully',
            data: parking
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

const endparking = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const { parkingId } = req.query

        const parking = await prisma.parking.findFirst({
            where: {
                id: parkingId,
                userId: req.user.id,
                status: { in: ['active', 'pending', 'in_progress'] }
            }
        })

        if (!parking) {
            return res.status(404).json({ message: 'Active parking session not found' })
        }

        const exitTime = new Date()
        const entryTime = new Date(parking.entryTime)
        const durationMinutes = Math.floor((exitTime - entryTime) / (1000 * 60))
        
        const hours = Math.floor(durationMinutes / 60)
        const minutes = durationMinutes % 60

        const updatedparking = await prisma.parking.update({
            where: { id: parkingId },
            data: {
                exitTime,
                status: 'completed'
            },
            include: {
                vehicle: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true
                    }
                }
            }
        })

        res.status(200).json({
            message: 'parking ended successfully',
            data: {
                ...updatedparking,
                duration: { hours, minutes, totalMinutes: durationMinutes }
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

const getActiveparking = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const parking = await prisma.parking.findFirst({
            where: {
                userId: req.user.id,
                status: { in: ['active', 'pending', 'in_progress'] }
            },
            include: {
                vehicle: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            },
            orderBy: {
                entryTime: 'desc'
            }
        })

        if (parking) {
            const entryTime = new Date(parking.entryTime)
            const now = new Date()
            const durationMinutes = Math.floor((now - entryTime) / (1000 * 60))
            const hours = Math.floor(durationMinutes / 60)
            const minutes = durationMinutes % 60

            res.status(200).json({
                success: true,
                data: {
                    ...parking,
                    duration: { hours, minutes, totalMinutes: durationMinutes }
                }
            })
        } else {
            res.status(200).json({
                success: true,
                data: null
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

const getparkingHistory = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const parkings = await prisma.parking.findMany({
            where: {
                userId: req.user.id,
                status: 'completed'
            },
            include: {
                vehicle: true
            },
            orderBy: {
                entryTime: 'desc'
            }
        })

        const formattedparkings = parkings.map(parking => {
            const entryTime = new Date(parking.entryTime)
            const exitTime = parking.exitTime ? new Date(parking.exitTime) : null
            const durationMinutes = exitTime ? Math.floor((exitTime - entryTime) / (1000 * 60)) : 0
            const hours = Math.floor(durationMinutes / 60)
            const minutes = durationMinutes % 60

            return {
                ...parking,
                duration: { hours, minutes, totalMinutes: durationMinutes }
            }
        })

        res.status(200).json({
            success: true,
            data: formattedparkings
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

const getparkingById = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const { parkingId } = req.query

        const parking = await prisma.parking.findFirst({
            where: {
                id: parkingId,
                userId: req.user.id
            },
            include: {
                vehicle: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true
                    }
                }
            }
        })

        if (!parking) {
            return res.status(404).json({ message: 'parking not found' })
        }

        const entryTime = new Date(parking.entryTime)
        const exitTime = parking.exitTime ? new Date(parking.exitTime) : new Date()
        const durationMinutes = Math.floor((exitTime - entryTime) / (1000 * 60))
        const hours = Math.floor(durationMinutes / 60)
        const minutes = durationMinutes % 60

        res.status(200).json({
            success: true,
            data: {
                ...parking,
                duration: { hours, minutes, totalMinutes: durationMinutes }
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

module.exports = {
    startparking,
    endparking,
    getActiveparking,
    getparkingHistory,
    getparkingById
}
