const User = require('../models/userModel')


const getUsers = async (req, res) =>{
    try {
        const users = await User.find({});

        res.status(200).json({users: users})

    } catch (error) {
        res.status(400).json({message:'Server error'})

    }
}

const getUserById = async (req, res) =>{
    try {
        const user = await User.findById(req.params.id);

        res.status(200).json({user: user})

    } catch (error) {
        res.status(400).json({message:'Server error'})

    }
}


module.exports = {
    getUsers,
    getUserById
}
