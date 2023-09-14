const router = require('express').Router()
const dotenv = require('dotenv').config()
const { getUsers, getUserById , setRoleById, deleteUserById, blockUserById, unBlockUserById} = require('../controllers/userController')


module.exports = router

router.route('/users').get(getUsers)
router.route('/users/:id').get(getUserById).put(setRoleById).delete(deleteUserById)
router.put('/users/:id/block', blockUserById)
router.put('/users/:id/unblock', unBlockUserById)
