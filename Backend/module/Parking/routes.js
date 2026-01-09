const express = require('express')
const { verifyUserMiddleware } = require('../Auth/middleware')
const { startParking, endParking, getActiveParking, getParkingHistory, getParkingById } = require('./controllers')
const router = express.Router()

router.post('/start', verifyUserMiddleware, startParking)
router.patch('/end', verifyUserMiddleware, endParking)
router.get('/active', verifyUserMiddleware, getActiveParking)
router.get('/history', verifyUserMiddleware, getParkingHistory)
router.get('/details', verifyUserMiddleware, getParkingById)

module.exports = router
