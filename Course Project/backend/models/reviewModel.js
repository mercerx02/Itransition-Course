const mongoose = require('mongoose');
const Comment = require('../models/commentModel')
const Piece = require('../models/pieceModel')

const reviewSchema = new mongoose.Schema({
  author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  piece: { type: mongoose.Schema.Types.ObjectId, ref: 'Piece' },
  group: String,
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  text: String,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  author_note: Number,
  photo_url: String,

},
{
  timestamps:true
});

reviewSchema.methods.toggleLike = async function(userId) {
  if (this.likes.includes(userId)) {
    this.likes.pull(userId);
  } else {
    this.likes.push(userId);
  }
  await this.save();
  return this;
};




reviewSchema.pre('remove', async function (next) {
  try {
    await mongoose.model('Comment').deleteMany({ review_id: this._id });
    await mongoose.model('Note').deleteMany({ review_id: this._id });
    next();
  } catch (error) {
    next(error);
  }
});


reviewSchema.post('remove', function (doc, next) {
  console.log(`Review with ID ${doc._id} was removed.`);
  next();
});


const Review = mongoose.model('Review', reviewSchema);


module.exports = Review;
