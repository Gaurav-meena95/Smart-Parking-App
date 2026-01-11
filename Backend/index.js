const express = require('express')
require('dotenv').config()
const app = express()
const corsMiddleware = require('./middleware/cors')

app.use(corsMiddleware)
app.use(express.json())

const port = process.env.PORT || 3000
const authenticationRoutes = require('./module/Auth/routes')
const vehicleRoutes = require('./module/User/vehiclesMangament/routes')
const usersProfile = require('./module/User/Profle/routes')
const parkingRoutes = require('./module/parking/routes')
const adminRoutes = require('./module/Admin/routes')
const managerRoutes = require('./module/Manager/routes')
const driverRoutes = require('./module/Driver/routes')

app.get('/', (req, res) => {
    return res.status(200).json({ message: 'Smart parking API is running' })
})

app.use('/api/auth/', authenticationRoutes)
app.use('/api/vehicles', vehicleRoutes)
app.use('/api/users', usersProfile)
app.use('/api/parking', parkingRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/manager', managerRoutes)
app.use('/api/driver', driverRoutes)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})