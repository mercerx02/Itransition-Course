const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please add a name'],
        uniqie: true
    },
    email: {
        type: String,
        required: [true, 'please add a email'],
        uniqie: true
    },
    password: {
        type: String,
        required: [true, 'please add a password'],
    },
    last_login_date: {
        type: Date,
        required: true,
    },
    is_banned: {
        type: Boolean,
        required: true,
        default: false
    },
},
    {
        timestamps: true
    })

module.exports = mongoose.model('User', userSchema)
