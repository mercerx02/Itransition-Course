const Tag = require('../models/tagModel')


const getTags = async (req, res) =>{
    try {
        const tags = await Tag.find({}, 'value count');

        res.status(200).json({tags: tags})

    } catch (error) {
        res.status(400).json({message:'Server error'})

    }
}

module.exports = {
    getTags
}
