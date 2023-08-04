const express = require('express')
const router = express.Router()
const { getUsers, updateUser, deleteUser, registerUser, loginUser, verify } = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')
module.exports = router

router.route('/').get(protect,getUsers).put(protect,updateUser).delete(protect,deleteUser)
router.post('/register',registerUser)
router.post('/login', loginUser)
router.post('/verify', verify)
