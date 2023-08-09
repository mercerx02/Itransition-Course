const mongoose = require('mongoose')


const messageSchema = mongoose.Schema({
    text: {
        type: String,
        required: true,

    },
    tags:{
        type: [String],
        required: true
    }
},{
    timestamps: true
})

module.exports = mongoose.model('Message',messageSchema)
