const router = require('express').Router()
const dotenv = require('dotenv').config()
const multer = require("multer");

const { createReview, getReviews, getReviewByID, reviewLike, sendComment, editReview , deleteReview, getMyReviews} = require('../controllers/reviewController')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });


module.exports = router



router.route('/reviews').post(upload.single('file'), createReview).get(getReviews)
router.get('/reviews/users/:id', getMyReviews)
router.route('/reviews/:id').get(getReviewByID).put(upload.single('file'), editReview).delete(deleteReview)
router.post('/reviews/:id/like', reviewLike)
router.post('/reviews/:id/comments', sendComment)
