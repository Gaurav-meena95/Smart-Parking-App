const { prisma } = require('../../DB/config')

const requestRetrieval = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const { parkingId } = req.body

        if (!parkingId) {
            return res.status(400).json({ message: 'parking ID is required' })
        }

        const parking = await prisma.parking.findFirst({
            where: {
                id: parkingId,
                userId: req.user.id,
                status: 'in_progress'
            }
        })

        if (!parking) {
            return res.status(404).json({ message: 'Active parking session not found' })
        }

        const updatedparking = await prisma.parking.update({
            where: { id: parkingId },
            data: {
                taskType: 'Retrieve',
                status: 'pending',
                assignedDriverId: null,
                assignedAt: null
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
            message: 'Retrieval request submitted successfully',
            data: updatedparking
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

module.exports = {
    requestRetrieval
}