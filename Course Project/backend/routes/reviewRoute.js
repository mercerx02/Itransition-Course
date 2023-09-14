const router = require('express').Router()
const dotenv = require('dotenv').config()
const multer = require("multer");

const { createReview, getReviews, getReviewByID, reviewLike, sendComment, editReview , deleteReview, getMyReviews, getReviewsByTag} = require('../controllers/reviewController')

const upload = multer();


module.exports = router



router.route('/reviews').post(upload.single('file'), createReview).get(getReviews)
router.get('/reviews/users/:id', getMyReviews)
router.get('/reviews/tags/:tag', getReviewsByTag)
router.route('/reviews/:id').get(getReviewByID).put(upload.single('file'), editReview).delete(deleteReview)
router.post('/reviews/:id/like', reviewLike)
router.post('/reviews/:id/comments', sendComment)
