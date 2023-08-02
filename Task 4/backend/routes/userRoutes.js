const express = require('express')
const router = express.Router()
const { getUsers, updateUser, deleteUser, registerUser, getMe, loginUser } = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')
module.exports = router

router.route('/').get(getUsers).post(registerUser)
router.post('/login', loginUser)
router.get('/me', getMe)
router.route('/:id').put(updateUser).delete(deleteUser)
