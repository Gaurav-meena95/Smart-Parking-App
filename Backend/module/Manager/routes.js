const express = require('express')
const { verifyUserMiddleware } = require('../Auth/middleware')
const { getDashboardStats, getparkingAssignments, addDriver, reassignValet, getAvailableDrivers } = require('./controllers')
const router = express.Router()
router.use(verifyUserMiddleware)

router.get('/dashboard', getDashboardStats)
router.get('/assignments', getparkingAssignments)
router.post('/add-driver', addDriver)
router.patch('/reassign-valet', reassignValet)
router.get('/drivers', getAvailableDrivers)

module.exports = router
