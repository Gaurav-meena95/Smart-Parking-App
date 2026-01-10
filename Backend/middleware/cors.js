const cors = require('cors')

const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://smart-parking-app-snowy.vercel.app/landing'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-refresh-token']
}

module.exports = cors(corsOptions)