const asyncHandler = require('express-async-handler')
// @desc Get Users
// @route GET /api/users
const getUsers = asyncHandler(async (req, res) => {
    res.status(200).json({ message: 'Get Users' })
})

// @desc Update User
// @route PUT /api/users/:id
const updateUser = asyncHandler(async (req, res) => {
    if (!req.body.key) {
        res.status(400)
        throw new Error('Provide a key')
    }
    res.status(200).json({ message: `Update user ${req.params.id}` })
})

// @desc Delete User
// @route DELETE /api/users/:id
const deleteUser = asyncHandler(async (req, res) => {
    res.status(200).json({ message: `Delete user ${req.params.id}` })
})


module.exports = {
    getUsers,
    updateUser,
    deleteUser,
}
