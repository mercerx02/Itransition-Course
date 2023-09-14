const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    provider_id: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    photo_url: {
      type: String
    },
    is_admin: {
      type: Boolean,
      required: true,
      default: false
    },
    is_blocked: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  {
    timestamps:true
  });

module.exports = mongoose.model('User', userSchema)
