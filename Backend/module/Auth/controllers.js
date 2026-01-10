const { prisma } = require('../../DB/config.js')
const sec_key = process.env.sec_key
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { validationInput } = require('../../utils/utils.js')

const signup = async (req, res) => {
    try {
        const { name, email, password, role, phone } = req.body
        const value = validationInput({ name, email, password, role })
        if (value) {
            return res.status(403).json({ message: `Check missing value ${value}` })
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(401).json({ message: "Invalid Email Address" })
        }
        if (!/(?=.*[!@#$%^&*])(?=.{6,})/.test(password)) {
            return res.status(400).json({ message: "Password must be at least 6 characters long and contain one special character" });
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(400).json({ message: 'User is already exists' })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const userRole = role || 'user'
        const approvalStatus = userRole === 'driver' ? 'pending' : null
        
        const newUser = await prisma.user.create({
            data: {
                name, 
                email,
                password: hashedPassword,
                phone: phone || null,
                role: userRole,
                approvalStatus: approvalStatus
            }
        });
        return res.status(201).json({
            message: 'Signup successful',
            user: newUser
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}

const login = async (req, res) => {
    try {
        const { email, password, role } = req.body
        const value = validationInput({ email, password, role })
        if (value) {
            return res.status(403).json({ message: `Check missing value ${value}` })
        }
        const existing = await prisma.user.findFirst({ 
            where: { 
                email, 
                role: role 
            } 
        })
        if (!existing) {
            return res.status(404).json({ message: "User not found or Check your Role " })
        } else {
            const isPasswordMatch = bcrypt.compareSync(password, existing.password)
            if (isPasswordMatch) {
                const jwtToken = await jwt.sign(
                    { id: existing.id, email: existing.email, role: existing.role },
                    sec_key,
                    { expiresIn: '1h' }
                )
                const refreshToken = await jwt.sign(
                    { id: existing.id, email: existing.email, role: existing.role },
                    sec_key,
                    { expiresIn: '7d' }
                )
                return res.status(200).json({
                    message: "Login Successfully",
                    user: existing,
                    token: jwtToken,
                    refreshToken
                });
            } else {
                return res.status(401).json({ message: 'Invalid credentials' })
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Login Faild', 'error': error.message })
    }
}

module.exports = { signup, login }