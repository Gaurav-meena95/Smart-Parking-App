const mongoose = require('mongoose')

const usersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    role: {
      type: String,
      enum: ['user', 'manager', 'driver', 'admin'],
      default: 'user'
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Users', usersSchema)
