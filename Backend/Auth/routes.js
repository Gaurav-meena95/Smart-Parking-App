const express = require('express')
const router = express.Router()
const { signup, login } = require('./controllers')
const { verifyUserMiddleware } = require('./middleware')

router.post('/signup',signup)
router.post('/login',login)
router.get('/me',verifyUserMiddleware,(req,res)=>{
    res.status(200).json(req.user)
})

module.exports = router