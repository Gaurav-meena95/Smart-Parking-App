const { prisma } = require('../../DB/config')

const getDashboardStats = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' })
        }

        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        const todayParkings = await prisma.parking.findMany({
            where: {
                entryTime: {
                    gte: today,
                    lt: tomorrow
                }
            }
        })

        const yesterdayParkings = await prisma.parking.findMany({
            where: {
                entryTime: {
                    gte: yesterday,
                    lt: today
                }
            }
        })

        const totalParkings = await prisma.parking.findMany({
            where: {
                status: 'completed'
            }
        })

        const activeParkings = await prisma.parking.findMany({
            where: {
                status: 'active'
            }
        })

        const todayTickets = todayParkings.length
        const yesterdayTickets = yesterdayParkings.length
        const ticketsGrowth = yesterdayTickets > 0
            ? ((todayTickets - yesterdayTickets) / yesterdayTickets * 100).toFixed(1)
            : todayTickets > 0 ? 100 : 0

        const todayCollection = todayParkings.reduce((sum, p) => sum + p.totalAmount, 0)
        const yesterdayCollection = yesterdayParkings.reduce((sum, p) => sum + p.totalAmount, 0)
        const collectionGrowth = yesterdayCollection > 0
            ? ((todayCollection - yesterdayCollection) / yesterdayCollection * 100).toFixed(1)
            : todayCollection > 0 ? 100 : 0

        const totalCollection = totalParkings.reduce((sum, p) => sum + p.totalAmount, 0)

        const locationGroups = await prisma.parking.groupBy({
            by: ['location'],
            _count: {
                id: true
            },
            _sum: {
                totalAmount: true
            }
        })

        const sites = await Promise.all(locationGroups.map(async (loc, index) => {
            const firstParking = await prisma.parking.findFirst({
                where: { location: loc.location },
                select: { address: true }
            })

            return {
                id: `site-${index + 1}`,
                name: loc.location,
                address: firstParking?.address || '',
                tickets: loc._count.id,
                collection: loc._sum.totalAmount || 0
            }
        }))

        res.status(200).json({
            success: true,
            data: {
                today: {
                    ticketsIssued: todayTickets,
                    collection: todayCollection,
                    ticketsGrowth: parseFloat(ticketsGrowth),
                    collectionGrowth: parseFloat(collectionGrowth)
                },
                overall: {
                    totalTickets: totalParkings.length,
                    totalCollection: totalCollection,
                    activeParking: activeParkings.length
                },
                sites: sites
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

const getAllUsers = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' })
        }

        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })

        res.status(200).json({
            success: true,
            data: users
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

const getPendingDriverApprovals = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' })
        }

        const pendingDrivers = await prisma.user.findMany({
            where: {
                role: 'driver',
                approvalStatus: 'pending'
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        res.status(200).json({
            success: true,
            data: pendingDrivers
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

const approveDriver = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' })
        }

        const { userId } = req.body
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' })
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: { approvalStatus: 'approved' }
        })

        res.status(200).json({
            success: true,
            message: 'Driver approved successfully',
            data: user
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

const rejectDriver = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' })
        }

        const { userId } = req.body
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' })
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: { approvalStatus: 'rejected' }
        })

        res.status(200).json({
            success: true,
            message: 'Driver rejected successfully',
            data: user
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

const getAllParkings = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' })
        }

        const parkings = await prisma.parking.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                vehicle: {
                    select: {
                        id: true,
                        vehicleName: true,
                        vehicleNumber: true
                    }
                }
            },
            orderBy: {
                entryTime: 'desc'
            }
        })

        res.status(200).json({
            success: true,
            data: parkings
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

module.exports = {
    getDashboardStats,
    getAllUsers,
    getAllParkings,
    getPendingDriverApprovals,
    approveDriver,
    rejectDriver
}
