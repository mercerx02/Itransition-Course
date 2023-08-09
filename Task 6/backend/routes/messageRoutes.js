const express = require('express')
const router = express.Router()
const { getMessages, addMessage} = require('../controllers/messageController')

module.exports = router

router.route('/messages').get(getMessages).post(addMessage)
