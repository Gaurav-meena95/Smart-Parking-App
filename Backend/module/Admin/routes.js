const express = require('express')
const { verifyUserMiddleware } = require('../Auth/middleware')
const { getDashboardStats, getAllUsers, getAllparkings, getPendingDriverApprovals, approveDriver, rejectDriver } = require('./controllers')
const router = express.Router()
router.use(verifyUserMiddleware)

router.get('/dashboard', getDashboardStats)
router.get('/users', getAllUsers)
router.get('/parkings', getAllparkings)
router.get('/pending-drivers', getPendingDriverApprovals)
router.post('/approve-driver', approveDriver)
router.post('/reject-driver', rejectDriver)

module.exports = router
