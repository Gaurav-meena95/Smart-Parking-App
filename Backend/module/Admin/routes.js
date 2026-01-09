const express = require('express')
const { verifyUserMiddleware } = require('../Auth/middleware')
const { getDashboardStats, getAllUsers, getAllParkings, getPendingDriverApprovals, approveDriver, rejectDriver } = require('./controllers')
const router = express.Router()

router.get('/dashboard', verifyUserMiddleware, getDashboardStats)
router.get('/users', verifyUserMiddleware, getAllUsers)
router.get('/parkings', verifyUserMiddleware, getAllParkings)
router.get('/pending-drivers', verifyUserMiddleware, getPendingDriverApprovals)
router.post('/approve-driver', verifyUserMiddleware, approveDriver)
router.post('/reject-driver', verifyUserMiddleware, rejectDriver)

module.exports = router
