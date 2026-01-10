const express = require('express')
const router = express.Router()
const { verifyUserMiddleware } = require('../Auth/middleware')
const {getAssignments,getCurrentAssignment,acceptAssignment,rejectAssignment,startTask,completeTask,getStats} = require('./controllers')

router.use(verifyUserMiddleware)

router.get('/assignments', getAssignments)
router.get('/current', getCurrentAssignment)
router.get('/stats', getStats)

router.post('/accept', acceptAssignment)
router.post('/reject', rejectAssignment)
router.post('/start', startTask)
router.post('/complete', completeTask)

module.exports = router
