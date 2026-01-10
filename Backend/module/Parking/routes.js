const express = require('express')
const { verifyUserMiddleware } = require('../Auth/middleware')
const { startParking, endParking, getActiveParking, getParkingHistory, getParkingById } = require('./controllers')
const router = express.Router()

router.use(verifyUserMiddleware)

router.post('/start', startParking)
router.patch('/end', endParking)
router.get('/active', getActiveParking)
router.get('/history', getParkingHistory)
router.get('/details', getParkingById)

module.exports = router
