const express = require('express')
const { addVehicles, updateVehicles, deleteVehicles, getAllVehicles } = require('./controllers')
const { verifyUserMiddleware } = require('../../Auth/middleware')
const router = express.Router()

router.post('/add',verifyUserMiddleware,addVehicles)
router.patch('/update',verifyUserMiddleware,updateVehicles)
router.delete('/delete',verifyUserMiddleware,deleteVehicles)
router.get('/all',verifyUserMiddleware,getAllVehicles)
module.exports = router