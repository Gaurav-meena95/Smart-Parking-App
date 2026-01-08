require('dotenv').config()
const mongoose = require('mongoose')
const mongoURl = process.env.mongoURI

const connectDb = async() =>{
    try {
        await mongoose.connect(mongoURl)
        console.log('mongoDb connected Successfully')
    } catch (error) {
        console.error('Failed to connect to MongoDB:', err.message);
        process.exit(1)

    }
}
module.exports = {connectDb}

