const asyncHandler = require('express-async-handler')

const Message = require('../models/messageModel')
const Tag = require('../models/TagModel')

const getMessages= asyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({}, 'text tags').populate('tags', 'name')
        const tags = await Tag.find({}, 'name');

        res.status(200).json({message: messages, tags: tags})

    } catch (error) {
        res.status(400).json({message:'Server error'})

    }
})



const addMessage = asyncHandler(async (req, res) => {
    try {
        const { text, tags } = req.body;

        let createdTags = [];

        if (tags && tags.length > 0) {
            createdTags = await Promise.all(
                tags.map(async tagName => {
                    const tag = await Tag.create({ name: tagName });
                    return tag._id;
                })
            );
        }

        const message = await Message.create({
            text: text,
            tags: createdTags,
        });

        res.status(200).json({ message: message });

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Server error' });
    }
});


module.exports = {
    getMessages,
    addMessage,
}
