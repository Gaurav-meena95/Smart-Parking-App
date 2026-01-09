const express = require('express')
require('dotenv').config()
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())

const port = process.env.PORT || 3000
const authenticationRoutes = require('./module/Auth/routes')
const vehicleRoutes = require('./module/User/vehiclesMangament/routes')
const usersProfile = require('./module/User/Profle/routes')
const parkingRoutes = require('./module/Parking/routes')

app.get('/', (req, res) => {
    return res.status(200).json({ message: 'Hello from Smart Parking' })
})

app.use('/api/auth/', authenticationRoutes)
app.use('/api/vehicles', vehicleRoutes)
app.use('/api/users', usersProfile)
app.use('/api/parking', parkingRoutes)

app.listen(port, () => {
    console.log(`server is successfully on ${port}`)
})