const { validationInput } = require("../../utils/utils")
const Vehicle = require('./db')



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
        const existingVehicle = await Vehicle.findOne({ vehicleNumber })
        if (existingVehicle) {
            return res.status(409).json({ message: 'Vehicle with this number already exists' })
        }

        const vehicle = await Vehicle.create({
            vehicleName,
            vehicleNumber,
            ownerName,
            ownerId: req.user.id,
            vehicleType
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
const updateVehicles = () => {
    try {

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}
const deleteVehicles = () => {
    try {

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}
const getAllVehicles = () => {
    try {

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

module.exports = { addVehicles, updateVehicles, deleteVehicles, getAllVehicles }