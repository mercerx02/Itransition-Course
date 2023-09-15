const cloudinary = require("cloudinary").v2;
const Review = require('../models/reviewModel')
const Tag = require('../models/tagModel')
const Comment = require('../models/commentModel')
const Piece = require('../models/pieceModel')
const dotenv = require('dotenv').config()

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY_CLOUDINARY,
    api_secret: process.env.API_SECRET_CLOUDINARY
  });


const save_tags = async (tags) => {
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
  return createdTags
}


const createReview = async (req, res) => {
  try {
      const { name, piece, group, tags, text, author_note, userId } = req.body;
      const fileBuffer = req.file.buffer; // Получить буфер файла

      const cloudinaryResponse = await cloudinary.uploader.upload_stream(
        async (error, result) => {
          if (error) {
            console.error('Ошибка загрузки в Cloudinary:', error);
            return res.status(500).json({ error: 'Ошибка загрузки в Cloudinary' });
          }

          // Создать теги
          const createdTags = await save_tags(tags);

          // Найти или создать произведение
          let new_pice = await Piece.findOne({name: piece})
          if(!new_pice){
            new_pice = await Piece.create({
              name: piece
            })
          }

          // Создать новый обзор
          const newReview = new Review({
            author_id: userId,
            piece: new_pice._id,
            name,
            group,
            tags: createdTags,
            text,
            author_note,
            photo_url: result.secure_url, // URL изображения из Cloudinary
          });

          await newReview.save();

          // Заполнить обзор данными и отправить в ответе
          const review = await Review.findById(newReview._id)
            .populate({ path: 'author_id'})
            .populate({ path: 'piece', populate: { path:'notes'} })
            .populate({ path: 'tags', select: 'value' })
            .populate({ path: 'likes', select: '_id'})
            .populate({ path: 'comments', populate: { path: 'user_id' } });

          res.status(200).json({ review: review });
        }
      ).end(fileBuffer);
  } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'Server error' });
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

const getReviewsByTag = async (req, res) =>{
  const tagValue = req.params.tag
  const tag = await Tag.findOne({value: tagValue})


  try {
    const reviews = await Review.find({ tags: { $in: [tag._id] } })
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

    const createdTags = await save_tags(tags)

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

    const updatedReview = await Review.findById(reviewId)
    .populate({ path: 'author_id'})
    .populate({ path: 'piece', populate: { path:'notes'} })
    .populate({ path: 'tags', select: 'value' })
    .populate({ path: 'likes', select: '_id'})
    .populate({ path: 'comments', populate: { path: 'user_id' } })

    res.status(200).json({ review: updatedReview});

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
    getReviewsByTag
}
