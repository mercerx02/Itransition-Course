const cloudinary = require("cloudinary").v2;
const Review = require('../models/reviewModel')
const Tag = require('../models/tagModel')
const Comment = require('../models/commentModel')
const Piece = require('../models/pieceModel')

cloudinary.config({
    cloud_name: 'dfjkvsox1',
    api_key: '224452213937319',
    api_secret: '0yDCsehsPjC5Lx47gfAuaScWXnQ'
  });



const createReview = async (req, res) => {
    try {
        const { name, piece, group, tags, text, author_note, userId } = req.body;
        const file = req.file;

        console.log(name)
        // const cloudinaryResponse = await cloudinary.uploader.upload(file.path);
        let createdTags = [];
        const parsed_tags = JSON.parse(tags)
        if (parsed_tags && parsed_tags.length > 0) {
            createdTags = await Promise.all(
                parsed_tags.map(async tagName => {
                    let tag = await Tag.findOne({ value: tagName });
                    if (tag) {
                      tag.count += 1;
                      await tag.save();
                    } else {
                      tag = await Tag.create({ value: tagName, count: 1 });
                    }
                    return tag._id;
                })
            );
        }

        let new_pice = await Piece.findOne({name: piece})
        if(!new_pice){
          new_pice = await Piece.create({
            name: piece
          })
        }

        const newReview = new Review({
            author_id: userId,
            piece: new_pice._id,
            name,
            group,
            tags: createdTags,
            text,
            author_note,
            photo_url: 'https://gamemag.ru/images/imagemanager/cache/01/d52b/01d52b_1-.jpg',
          });
        await newReview.save();
        // console.log(cloudinaryResponse.secure_url)
        const review = await Review.findById(newReview._id)
        .populate({ path: 'author_id'})
        .populate({ path: 'piece', populate: { path:'notes'} })
        .populate({ path: 'tags', select: 'value' })
        .populate({ path: 'likes', select: '_id'})
        .populate({ path: 'comments', populate: { path: 'user_id' } })
        res.json({ review: review});
      } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Server error" });
      }
};


const getReviews = async (req, res) =>{
  try {
    const reviews = await Review.find({})
    .populate({ path: 'author_id'})
    .populate({ path: 'piece', populate: { path:'notes'} })
    .populate({ path: 'tags', select: 'value' })
    .populate({ path: 'likes', select: '_id'})
    .populate({ path: 'comments', populate: { path: 'user_id' } })

    res.status(200).json({reviews: reviews})
  } catch (error) {
    console.log(error)
    res.status(400).json({message:'Server error'})

  }

}

const getMyReviews = async (req, res) =>{

  try {
    const reviews = await Review.find({author_id : req.params.id})
    .populate({ path: 'author_id'})
    .populate({ path: 'piece', populate: { path:'notes'} })
    .populate({ path: 'tags', select: 'value' })
    .populate({ path: 'likes', select: '_id'})
    .populate({ path: 'comments', populate: { path: 'user_id' } })

    res.status(200).json({reviews: reviews})
  } catch (error) {
    console.log(error)
    res.status(400).json({message:'Server error'})

  }

}

const getReviewByID = async (req, res) =>{
  try {
    const review = await Review.findById(req.params.id)
    .populate({ path: 'author_id'})
    .populate({ path: 'piece', populate: { path:'notes'} })
    .populate({ path: 'tags', select: 'value' })
    .populate({ path: 'likes', select: '_id'})
    .populate({ path: 'comments', populate: { path: 'user_id' } })
    res.status(200).json({review: review})
  } catch (error) {
    console.log(error)
    res.status(400).json({message:'Server error'})

  }

}

const reviewLike = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await review.toggleLike(userId);
    const updatedReview = await Review.findById(reviewId)
    .populate({ path: 'author_id'})
    .populate({ path: 'piece', populate: { path:'notes'} })
    .populate({ path: 'tags', select: 'value' })
    .populate({ path: 'likes', select: '_id'})
    .populate({ path: 'comments', populate: { path: 'user_id' } })
    res.status(200).json({ review: updatedReview });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};


const sendComment = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user._id;
    const { text } = req.body;

    const newComment = new Comment({
      user_id: userId,
      text: text,
      review_id: reviewId
    });

    await newComment.save();

    const review = await Review.findById(reviewId);
    review.comments.push(newComment._id);

    await review.save();

    const updatedReview = await Review.findById(reviewId)
      .populate({ path: 'author_id' })
      .populate({ path: 'piece', populate: { path:'notes'} })
      .populate({ path: 'tags', select: 'value' })
      .populate({ path: 'likes', select: '_id' })
      .populate({ path: 'comments', populate: { path: 'user_id' } })

    res.status(201).json({ review: updatedReview });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};


const editReview = async (req, res) => {
  const { name, piece, group, tags, text, author_note} = req.body;

  const reviewId = req.params.id;

  try{
    const review = await Review.findById(reviewId).populate({ path: 'tags', select: 'value' });

    const parsed_tags = JSON.parse(tags)
    let createdTags = [];

    if (parsed_tags && parsed_tags.length > 0) {
        createdTags = await Promise.all(
            parsed_tags.map(async tagName => {
                let tag = await Tag.findOne({ value: tagName });
                if (tag) {
                  tag.count += 1;
                  await tag.save();
                } else {
                  tag = await Tag.create({ value: tagName, count: 1 });
                }
                return tag._id;
            })
        );
    }
    let new_pice = await Piece.findOne({name: piece})
    if(!new_pice){
      new_pice = await Piece.create({
        name: piece
      })
    }
    review.name = name
    review.piece = new_pice._id
    review.group = group
    review.text = text
    review.author_note = author_note
    review.tags = createdTags
    await review.save()
    res.status(200).json({message:'Successful'})
} catch(error){
  console.error(error);
  res.status(500).json({ message: 'Server error' });
}

}

const deleteReview = async (req, res) => {
  const reviewId = req.params.id;
  try {
    await Review.findByIdAndDelete(reviewId)
    res.status(200).json({ message:'Successful' })
  } catch (error) {
    res.status(500).json({ message: 'Server error' });

  }

}


module.exports = {
    createReview,
    getReviews,
    getMyReviews,
    getReviewByID,
    reviewLike,
    sendComment,
    editReview,
    deleteReview,
}
