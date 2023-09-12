const router = require('express').Router()
const dotenv = require('dotenv').config()
const { getTags } = require('../controllers/tagContoller')


module.exports = router

router.route('/tags').get(getTags)
