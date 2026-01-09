const { connectDB } = require('./DB/prisma')
const express = require('express')
require('dotenv').config()
const app = express()
app.use(express.json())
const port = process.env.PORT || 3000
const authenticationRoutes = require('./Auth/routes')
const vehicleRoutes = require('./User/vehiclesMangament/routes')

connectDB()
app.get('/', (req, res) => {
    console.log('object')
    return res.status(200).json({ message: 'Hello from Smart Parking' })
})
app.use('/api/auth/', authenticationRoutes)
app.use('/api/vehicles', vehicleRoutes)

app.listen(port, () => {
    console.log(`server is successfully on ${port}`)
})

