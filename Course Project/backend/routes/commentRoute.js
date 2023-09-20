const router = require('express').Router()

const { getComments } = require('../controllers/commentController')


module.exports = router

router.route('/comments').get(getComments)
