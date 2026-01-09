const express = require('express')
const { verifyUserMiddleware } = require('../../Auth/middleware')
const { updateProfile } = require('./controllers')
const router = express.Router()

router.patch('/profile/update',verifyUserMiddleware,updateProfile)
module.exports = router