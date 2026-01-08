const mongoose = require('mongoose')

const vehicleSchema = new mongoose.Schema(
  {
    vehicleName: {
      type: String,
      required: true,
    },

    vehicleNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },

    ownerName: {
      type: String,
      required: true,
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },

    vehicleType: {
      type: String,
      enum: ['car', 'bike', 'suv'],
      default: 'car'
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Vehicle', vehicleSchema)
