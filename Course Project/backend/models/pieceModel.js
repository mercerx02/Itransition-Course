const mongoose = require('mongoose');
const Note = require('../models/noteModel')


const pieceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }],

  },
  {
    timestamps:true
  });


  pieceSchema.methods.updateRating = async function(userId, newValue) {
    try {


      let userNote = this.notes.find((note) => note.user_id.equals(userId));

      if (userNote) {
        userNote.note = newValue;
      } else {
        userNote = await Note.create({ user_id: userId, note: newValue, piece_id: this._id });
        this.notes.push(userNote);
      }

      await this.save();
      await userNote.save();

      return this;
    } catch (error) {
      throw error;
    }
  };


const Piece = mongoose.model('Piece', pieceSchema);


module.exports = Piece;
