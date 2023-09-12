const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
    unique: true,
  },
  count:{
    type: Number,
    default: 1

  }
});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
