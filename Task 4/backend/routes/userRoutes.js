const express = require('express')
const router = express.Router()
const { getUsers, updateUser, deleteUser } = require('../controllers/userController')
module.exports = router

router.get('/', getUsers)

router.route('/:id').put(updateUser).delete(deleteUser)
