const mongoose = require('mongoose');
const Review = require('../models/reviewModel')

const commentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  review_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Review' }
},
{
  timestamps:true
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
