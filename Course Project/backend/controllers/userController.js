const User = require('../models/userModel')


const updateUserStatus = async (user_id, status) => {
    const user = await User.findById(user_id)
    user.is_blocked = status
    await user.save()
    const updated_user = await User.findById(id)
    return updated_user

}


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

const setRoleById = async (req, res) => {
    try {
        const id = req.params.id
        const user = await User.findById(id)
        user.is_admin = !user.is_admin
        await user.save()
        const updated_user = await User.findById(id)
        res.status(200).json({user: updated_user})


    } catch (error) {
        res.status(400).json({message:'Server error'})

    }
}

const deleteUserById = async (req, res) => {
    try {

        const id = req.params.id
        const user = await User.findById(id)
        console.log(user)
        await user.deleteOne()
        res.status(200).json({user: user})

    } catch (error) {
        res.status(400).json({message:'Server error'})

    }

}

const blockUserById = async (req, res) => {
    try {

        const id = req.params.id
        console.log(id)
        const updated_user = await updateUserStatus(id, false)
        res.status(200).json({user: updated_user})

    } catch (error) {
        console.log(error)
        res.status(400).json({message:'Server error'})

    }

}

const unBlockUserById = async (req, res) => {
    try {

        const id = req.params.id
        const updated_user = await updateUserStatus(id, false)
        res.status(200).json({user: updated_user})

    } catch (error) {
        res.status(400).json({message:'Server error'})

    }

}


module.exports = {
    getUsers,
    getUserById,
    setRoleById,
    deleteUserById,
    blockUserById,
    unBlockUserById
}
