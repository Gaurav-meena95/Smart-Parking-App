const express = require('express')
const { addVehicles, updateVehicles, deleteVehicles, getAllVehicles } = require('./controllers')
const { verifyUserMiddleware } = require('../../Auth/middleware')
const router = express.Router()
router.use(verifyUserMiddleware)

router.post('/add', addVehicles)
router.patch('/update', updateVehicles)
router.delete('/delete', deleteVehicles)
router.get('/all', getAllVehicles)
module.exports = router