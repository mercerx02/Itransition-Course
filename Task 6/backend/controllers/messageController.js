const asyncHandler = require('express-async-handler')

const Message = require('../models/messageModel')


const getMessages= asyncHandler(async (req, res) => {
    try {
        const messges = await Message.find({}, '_id text tags');
        res.status(200).json(messges)

    } catch (error) {
        res.status(400).json({message:'Server error'})

    }
})
const addMessage = asyncHandler(async (req, res) => {
    try {

        const {text, tags} = req.body

        const message = await Message.create({
            text: text,
            tags: tags,

        })
        res.status(200).json({message: message})

    } catch (error) {
        console.log(error)
        res.status(400).json({message:'Server error'})

    }
})


module.exports = {
    getMessages,
    addMessage
}
