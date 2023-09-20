const Comment = require('../models/commentModel')


const getComments = async (req, res) => {
    const review_id = req.params.id
    try {
        const comments = await Comment.find({review_id: review_id})
        .populate({path:'user_id'})
        res.status(200).json({comments: comments})

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}
module.exports = {
    getComments

}
