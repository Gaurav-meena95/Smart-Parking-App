const { validationInput } = require("../../../utils/utils")
const { prisma } = require('../../../DB/config')


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
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const { vehicleId } = req.query
        const { vehicleName, ownerName, vehicleType, isActive } = req.body

        const existingVehicle = await prisma.vehicle.findFirst({
            where: {
                id: vehicleId,
                ownerId: req.user.id
            }
        })

        if (!existingVehicle) {
            return res.status(404).json({
                message: 'Vehicle not found or access denied'
            })
        }

        const updateData = {}
        if (vehicleName) updateData.vehicleName = vehicleName
        if (ownerName) updateData.ownerName = ownerName
        if (vehicleType) updateData.vehicleType = vehicleType
        if (isActive !== undefined) updateData.isActive = isActive

        const vehicle = await prisma.vehicle.update({
            where: { id: vehicleId },
            data: updateData
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
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }
        const { id } = req.query
        const vehicle = await prisma.vehicle.findFirst({
            where: {
                id,
                ownerId: req.user.id
            }
        })
        if (!vehicle) {
            return res.status(404).json({
                message: 'Vehicle not found or access denied'
            })
        }
        await prisma.vehicle.delete({
            where: { id }
        })
        res.status(200).json({
            message: 'Vehicle deleted successfully'
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}


const getAllVehicles = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const vehicles = await prisma.vehicle.findMany({
      where: {
        ownerId: req.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    res.status(200).json({
      success: true,
      message: 'Vehicles fetched successfully',
      data: vehicles
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}


module.exports = { addVehicles, updateVehicles, deleteVehicles, getAllVehicles }