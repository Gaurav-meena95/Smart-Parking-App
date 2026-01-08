const express = require('express')
const { addVehicles, updateVehicles, deleteVehicles, getAllVehicles } = require('./controllers')
const { verifyUserMiddleware } = require('../../Auth/middleware')
const router = express.Router()

router.post('/add',verifyUserMiddleware,addVehicles)
router.post('/update',updateVehicles)
router.post('/delete',deleteVehicles)
router.post('/all',getAllVehicles)
module.exports = router