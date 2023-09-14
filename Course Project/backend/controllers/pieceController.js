const Piece = require('../models/pieceModel')
const Review = require('../models/reviewModel')

const getPieces = async (req, res) => {
    try {
        const pieces = await Piece.find({})
        .populate({path:'notes'})
        res.status(200).json({pieces: pieces})

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}


const ratePiece = async (req, res) => {
    try {
      const reviewId = req.params.id;
      const userId = req.user._id;
      const newValue = req.body.newValue;
      const review = await Review.findById(reviewId);
      const piece_id = review.piece
      const piece = await Piece.findById(piece_id).populate({path:'notes'})

      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }
      await piece.updateRating(userId, newValue);

      const updatedReview = await Review.findById(reviewId)
        .populate({ path: 'author_id' })
        .populate({ path: 'piece', populate: { path:'notes'} })
        .populate({ path: 'tags', select: 'value' })
        .populate({ path: 'likes', select: '_id' })
        .populate({ path: 'comments', populate: { path: 'user_id' } })

      res.status(200).json({review: updatedReview});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };



module.exports = {
    ratePiece,
    getPieces
}
