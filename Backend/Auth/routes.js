const express = require('express')
const { signup, login } = require('./controllers')
const { verifyUserMiddleware } = require('./middleware')
const router = express.Router()

router.post('/signup',signup)
router.post('/login',login)
router.get('/me',verifyUserMiddleware,(req,res)=>{
    res.status(200).json(req.user)
})

module.exports = {router}