const express = require('express')
const { verifyUserMiddleware } = require('../Auth/middleware')
const { startparking, endparking, getActiveparking, getparkingHistory, getparkingById,  } = require('./controllers')
const { requestRetrieval } = require('./retrieveController')
const router = express.Router()

router.use(verifyUserMiddleware)

router.post('/start', startparking)
router.post('/request-retrieval', requestRetrieval)
router.patch('/end', endparking)
router.get('/active', getActiveparking)
router.get('/history', getparkingHistory)
router.get('/details', getparkingById)
// router.get('/qr/:ticketId', getparkingByTicketId)

module.exports = router
