const { prisma } = require('../../DB/config')

const getAssignments = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        if (req.user.role !== 'driver') {
            return res.status(403).json({ message: 'Access denied. Driver role required.' })
        }

        const assignments = await prisma.parking.findMany({
            where: {
                assignedDriverId: req.user.id,
                status: 'pending'
            },
            include: {
                vehicle: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        mobile: true
                    }
                }
            },
            orderBy: {
                assignedAt: 'desc'
            }
        })

        res.status(200).json({
            success: true,
            data: assignments
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

// Get current active assignment
const getCurrentAssignment = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        if (req.user.role !== 'driver') {
            return res.status(403).json({ message: 'Access denied. Driver role required.' })
        }

        const assignment = await prisma.parking.findFirst({
            where: {
                assignedDriverId: req.user.id,
                status: 'in_progress'
            },
            include: {
                vehicle: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        mobile: true
                    }
                }
            },
            orderBy: {
                assignedAt: 'desc'
            }
        })

        res.status(200).json({
            success: true,
            data: assignment
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

// Accept an assignment
const acceptAssignment = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        if (req.user.role !== 'driver') {
            return res.status(403).json({ message: 'Access denied. Driver role required.' })
        }

        const { parkingId } = req.body

        if (!parkingId) {
            return res.status(400).json({ message: 'parkingId is required' })
        }

        // Check if driver already has an active assignment
        const activeAssignment = await prisma.parking.findFirst({
            where: {
                assignedDriverId: req.user.id,
                status: 'in_progress'
            }
        })

        if (activeAssignment) {
            return res.status(400).json({ message: 'You already have an active assignment. Please complete it first.' })
        }

        // Find and update the parking assignment
        const parking = await prisma.parking.findFirst({
            where: {
                id: parkingId,
                assignedDriverId: req.user.id,
                status: 'pending'
            }
        })

        if (!parking) {
            return res.status(404).json({ message: 'Assignment not found or already accepted' })
        }

        const updatedParking = await prisma.parking.update({
            where: { id: parkingId },
            data: {
                status: 'in_progress'
            },
            include: {
                vehicle: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        mobile: true
                    }
                }
            }
        })

        res.status(200).json({
            success: true,
            message: 'Assignment accepted successfully',
            data: updatedParking
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

// Reject an assignment
const rejectAssignment = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        if (req.user.role !== 'driver') {
            return res.status(403).json({ message: 'Access denied. Driver role required.' })
        }

        const { parkingId } = req.body

        if (!parkingId) {
            return res.status(400).json({ message: 'parkingId is required' })
        }

        const parking = await prisma.parking.findFirst({
            where: {
                id: parkingId,
                assignedDriverId: req.user.id,
                status: 'pending'
            }
        })

        if (!parking) {
            return res.status(404).json({ message: 'Assignment not found or already processed' })
        }

        // Remove driver assignment
        const updatedParking = await prisma.parking.update({
            where: { id: parkingId },
            data: {
                assignedDriverId: null,
                assignedAt: null
            }
        })

        res.status(200).json({
            success: true,
            message: 'Assignment rejected successfully'
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

// Start the parking/retrieval task
const startTask = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        if (req.user.role !== 'driver') {
            return res.status(403).json({ message: 'Access denied. Driver role required.' })
        }

        const { parkingId } = req.body

        if (!parkingId) {
            return res.status(400).json({ message: 'parkingId is required' })
        }

        const parking = await prisma.parking.findFirst({
            where: {
                id: parkingId,
                assignedDriverId: req.user.id,
                status: 'in_progress'
            }
        })

        if (!parking) {
            return res.status(404).json({ message: 'Assignment not found' })
        }

        res.status(200).json({
            success: true,
            message: 'Task started successfully',
            data: parking
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

// Complete the current task
const completeTask = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        if (req.user.role !== 'driver') {
            return res.status(403).json({ message: 'Access denied. Driver role required.' })
        }

        const { parkingId } = req.body

        if (!parkingId) {
            return res.status(400).json({ message: 'parkingId is required' })
        }

        const parking = await prisma.parking.findFirst({
            where: {
                id: parkingId,
                assignedDriverId: req.user.id,
                status: 'in_progress'
            }
        })

        if (!parking) {
            return res.status(404).json({ message: 'Active assignment not found' })
        }

        const updatedParking = await prisma.parking.update({
            where: { id: parkingId },
            data: {
                status: 'completed',
                exitTime: new Date()
            },
            include: {
                vehicle: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        mobile: true
                    }
                }
            }
        })

        res.status(200).json({
            success: true,
            message: 'Task completed successfully',
            data: updatedParking
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

// Get driver statistics
const getStats = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        if (req.user.role !== 'driver') {
            return res.status(403).json({ message: 'Access denied. Driver role required.' })
        }

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const todayParked = await prisma.parking.count({
            where: {
                assignedDriverId: req.user.id,
                status: 'completed',
                taskType: 'PARK',
                updatedAt: {
                    gte: today
                }
            }
        })

        const todayRetrieved = await prisma.parking.count({
            where: {
                assignedDriverId: req.user.id,
                status: 'completed',
                taskType: 'RETRIEVE',
                updatedAt: {
                    gte: today
                }
            }
        })

        const newAssignments = await prisma.parking.count({
            where: {
                assignedDriverId: req.user.id,
                status: 'pending'
            }
        })

        res.status(200).json({
            success: true,
            data: {
                today: {
                    parked: todayParked,
                    retrieved: todayRetrieved
                },
                newAssignments
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

module.exports = {
    getAssignments,
    getCurrentAssignment,
    acceptAssignment,
    rejectAssignment,
    startTask,
    completeTask,
    getStats
}
