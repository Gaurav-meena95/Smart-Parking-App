const express = require('express')
const router = express.Router()
const { verifyUserMiddleware } = require('../Auth/middleware')
const {
    getAssignments,
    getCurrentAssignment,
    acceptAssignment,
    rejectAssignment,
    startTask,
    completeTask,
    getStats
} = require('./controllers')

// All routes require authentication
router.use(verifyUserMiddleware)

// GET routes
router.get('/assignments', getAssignments)
router.get('/current', getCurrentAssignment)
router.get('/stats', getStats)

// POST routes
router.post('/accept', acceptAssignment)
router.post('/reject', rejectAssignment)
router.post('/start', startTask)
router.post('/complete', completeTask)

module.exports = router
