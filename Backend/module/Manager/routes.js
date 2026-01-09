const express = require('express')
const { verifyUserMiddleware } = require('../Auth/middleware')
const { getDashboardStats, getParkingAssignments, addDriver, reassignValet, getAvailableDrivers } = require('./controllers')
const router = express.Router()

router.get('/dashboard', verifyUserMiddleware, getDashboardStats)
router.get('/assignments', verifyUserMiddleware, getParkingAssignments)
router.post('/add-driver', verifyUserMiddleware, addDriver)
router.patch('/reassign-valet', verifyUserMiddleware, reassignValet)
router.get('/drivers', verifyUserMiddleware, getAvailableDrivers)

module.exports = router
