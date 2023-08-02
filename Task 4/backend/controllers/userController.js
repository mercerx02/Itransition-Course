const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const moment = require('moment-timezone')
const User = require('../models/userModel')

// @desc Get Users
// @route GET /api/users
// @access Private
const getUsers = asyncHandler(async (req, res) => {
    res.status(200).json({ message: 'Get Users' })
})

// @desc Update User
// @route PUT /api/users/:id
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    if (!req.body.key) {
        res.status(400)
        throw new Error('Provide a key')
    }
    res.status(200).json({ message: `Update user ${req.params.id}` })
})

// @desc Delete User
// @route DELETE /api/users/:id
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    res.status(200).json({ message: `Delete user ${req.params.id}` })
})


// @desc Register User
// @route POST /api/users/
// @access Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        res.status(400)
        throw new Error('Please add all fields')
    }

    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        last_login_date: moment().tz('Europe/Minsk').toDate(),
        is_banned: false,
    })
    if (user) {
        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)

        })
    } else {
        throw new Error('Invalid user data')
    }


})

// @desc Authenicate User
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (user && (await bcrypt.compare(password, user.password))) {
        const token = generateToken(user._id);

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: token

        })
    }
    else {

        res.status(400)
        throw new Error('Invalid username or password')
    }

})

// @desc Get User data
// @route GET /api/users/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
    res.status(200).json({ message: `User data` })
})

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        'expiresIn': '30d'
    })
}

module.exports = {
    getUsers,
    updateUser,
    deleteUser,
    registerUser,
    loginUser,
    getMe
}
