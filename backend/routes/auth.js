const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

// Register 
router.post('/register', async (req, res) => {
    try {
        // Generate new password to protect from hackers
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        // Create new User 
        const newUser = await new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })

        // Save user and respond
        const user = await newUser.save()
        res.status(200).json(user)

    } catch (error) {
        res.status(500).send('Internal server error')
    }
})

// User Login in 
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        !user && res.status(404).send('User not found!! / Invalid credentials')

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        !validPassword && res.status(400).send('Invalid credentials!!')

        res.status(200).json(user)

    } catch (error) {
        res.status(500).send('Internal server error')
    }
})

module.exports = router