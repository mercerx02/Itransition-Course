const router = require('express').Router()
const dotenv = require('dotenv').config()
const { getUsers, getUserById } = require('../controllers/userController')


module.exports = router

router.route('/users').get(getUsers)
router.get('/users/:id', getUserById)
