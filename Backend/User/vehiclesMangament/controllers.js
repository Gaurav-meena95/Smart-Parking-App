const { validationInput } = require("../../utils/utils")
const { prisma } = require('../../DB/prisma')

const addVehicles = async (req, res) => {
    try {
        const { vehicleName, vehicleNumber, ownerName, vehicleType } = req.body

        const value = validationInput({ vehicleName, vehicleNumber, ownerName, vehicleType })
        if (value) {
            return res.status(400).json({ message: `Missing field: ${value}` })
        }

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }
        
        const existingVehicle = await prisma.vehicle.findUnique({ 
            where: { vehicleNumber } 
        })
        if (existingVehicle) {
            return res.status(409).json({ message: 'Vehicle with this number already exists' })
        }

        const vehicle = await prisma.vehicle.create({
            data: {
                vehicleName,
                vehicleNumber,
                ownerName,
                ownerId: req.user.id,
                vehicleType: vehicleType
            }
        })

        res.status(201).json({
            message: 'Vehicle added successfully',
            data: vehicle
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

const updateVehicles = async (req, res) => {
    try {
        const { id } = req.params
        const { vehicleName, vehicleNumber, ownerName, vehicleType, isActive } = req.body

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const vehicle = await prisma.vehicle.update({
            where: { id },
            data: {
                ...(vehicleName && { vehicleName }),
                ...(vehicleNumber && { vehicleNumber }),
                ...(ownerName && { ownerName }),
                ...(vehicleType && { vehicleType: vehicleType }),
                ...(isActive !== undefined && { isActive })
            }
        })

        res.status(200).json({
            message: 'Vehicle updated successfully',
            data: vehicle
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

const deleteVehicles = async (req, res) => {
    try {
        const { id } = req.params

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        await prisma.vehicle.delete({
            where: { id }
        })

        res.status(200).json({
            message: 'Vehicle deleted successfully'
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

const getAllVehicles = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const vehicles = await prisma.vehicle.findMany({
            where: { ownerId: req.user.id },
            include: { owner: true }
        })

        res.status(200).json({
            message: 'Vehicles retrieved successfully',
            data: vehicles
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

module.exports = { addVehicles, updateVehicles, deleteVehicles, getAllVehicles }