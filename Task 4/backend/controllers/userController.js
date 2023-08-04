const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const moment = require('moment-timezone')
const User = require('../models/userModel')




const getUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find({}, '_id name email last_login_date is_banned createdAt');
        res.status(200).json(users)

    } catch (error) {
        res.status(400).json({message:'Server error'})

    }
})


const updateUser = asyncHandler(async (req, res) => {

    try {
        const user = await User.findById(req.body.id);
        if(req.body.action == 'block'){
            user.is_banned = true
        }
        else{
            user.is_banned = false
        }
        const updatedUser = await user.save();
        res.status(200).json({ message: `Update user ${req.body.id}` })


    } catch (error) {
        console.log(error)

    }
})



const deleteUser = asyncHandler(async (req, res) => {
    try {
        const result = await User.findByIdAndDelete(req.body.id);
        res.status(200).json({message:`User ${req.body.id} has been delete`})

    } catch (error) {
        res.status(200).json({message:'Server error'})
    }

})



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
        })
    } else {
        throw new Error('Invalid user data')
    }


})


const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (user && (await bcrypt.compare(password, user.password))) {
        const token = generateToken(user._id);

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            is_banned: user.is_banned,
            token: token

        })
    }
    else {

        res.status(400)
        throw new Error('Invalid username or password')
    }

})



const getMe = asyncHandler(async (req, res) => {
    res.status(200).json({ message: `User data` })
})

const verify = asyncHandler(async (req, res) => {
    const token = req.headers.authorization;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id).select('-password')
        if (user && !user.is_banned){
            res.status(200).json(user)
        }
        else{
            res.status(400).json({message:'Invalid jwt token or user is banned'})
        }

    } catch (error) {
      res.status(401).json({ message: 'Ошибка при проверке токена' });
    }


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
    getMe,
    verify
}
