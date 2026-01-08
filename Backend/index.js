const {connectDb} = require('./DB/mainDB')
const express = require('express')
const app = express()
app.use(express.json)
const port = process.env.PORT 
connectDb()
const authenticaton = require('./Auth/routes')

app.use('api/auth',authenticaton)

app.listen(port , ()=>{
    console.log(`server is successfully on ${port}`)
})

