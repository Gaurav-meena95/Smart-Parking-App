
const express = require('express')
require('dotenv').config()
const app = express()
app.use(express.json())
const port = process.env.PORT || 3000
const authenticationRoutes = require('./module/Auth/routes')
const vehicleRoutes = require('./module/User/vehiclesMangament/routes')
const usersProfile = require('./module/User/Profle/routes')

app.get('/', (req, res) => {
    console.log('object')
    return res.status(200).json({ message: 'Hello from Smart Parking' })
})
app.use('/api/auth/', authenticationRoutes)
app.use('/api/vehicles', vehicleRoutes)
app.use('/api/users', usersProfile)

app.listen(port, () => {
    console.log(`server is successfully on ${port}`)
})

