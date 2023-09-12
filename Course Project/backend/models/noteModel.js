const mongoose = require('mongoose');
const Piece = require('../models/pieceModel')
const noteSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  note: Number,
  piece_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Piece' }

});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
