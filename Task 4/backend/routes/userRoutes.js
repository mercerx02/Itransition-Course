const express = require('express')
const router = express.Router()
const { getUsers, updateUser, deleteUser, registerUser, getMe, loginUser, verify } = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')
module.exports = router

router.route('/').get(protect,getUsers).put(updateUser).delete(deleteUser)
router.post('/register',registerUser)
router.post('/login', loginUser)
router.get('/me', getMe)
router.post('/verify', verify)
