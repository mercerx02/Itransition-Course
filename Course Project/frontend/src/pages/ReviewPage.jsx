import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Button, TextField, Box, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import DeleteReviewDialog from '../components/DeleteReviewDialog';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ReactMarkdown from 'react-markdown'
import { useTranslation } from "react-i18next";
import { getReviewById } from '../services/reviewsService';
import { useParams } from 'react-router-dom';
import { submitComment } from '../services/commentService';
import { usePDF } from 'react-to-pdf';
import { getComments } from '../services/commentService';
import { calculateAverageRating } from '../services/calculateAvgRating';
import StarIcon from '@mui/icons-material/Star';
import { ratePiece } from '../services/pieceService';
import { PeopleAltOutlined } from '@mui/icons-material';

const ReviewPage = ({user, setReviews, reviews, setAlertMessage, setOpenAlert, adminMode}) => {
  const { id } = useParams()
  const [review, setReview] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()
  const { toPDF, targetRef } = usePDF({filename: `review_${id}.pdf`});
  const [comments, setComments] = useState([])

  useEffect(()=>{
    const fetchComments = async () =>{
      const comments = await getComments(id)
      setComments(comments)
    }

    fetchComments()

    const interval = setInterval(() => {
      fetchComments();
    }, 2000);

    return () => {
      clearInterval(interval);
    };


  },[])


const handleOpenDialog = () =>{
  setOpen(true)
}

  useEffect(() => {
    getReviewById(id)
    .then(result => setReview(result))
  }, []);

  const handleCommentSubmit = async () => {
    try {
      const newReview = await submitComment(id, newComment)
      setReview(newReview);
      setReviews(reviews.map((review)=>{
        return review._id === newReview._id ? newReview : review
      }))
      setNewComment('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleUserRatingChange = async (reviewId, newValue) => {
    try {
      const updatedReview = await ratePiece(reviewId, newValue)
      setReview(updatedReview)
      setReviews(reviews.map((review)=>{
        return review._id === updatedReview._id ? updatedReview : review
      }))
    } catch (error) {

    }

  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 20 }}>
      {review ? (
        <>
        <div ref={targetRef}>
        <DeleteReviewDialog setReviews={setReviews} setOpenAlert={setOpenAlert} setAlertMessage={setAlertMessage} reviewId={review._id} open={open} setOpen={setOpen}></DeleteReviewDialog>
        {user && (user._id === review.author_id._id || adminMode) && (
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Link to={`/review/${review._id}/edit`} style={{ textDecoration: 'none' }}>
                <IconButton>
                  <EditIcon/>
                </IconButton>
              </Link>
              <IconButton onClick={handleOpenDialog}>
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
          <img
            src={review.photo_url}
            alt={review.name}
            style={{
              maxWidth: '100%',
              width: '100%',
              marginBottom: 20,
              boxShadow: 18,
            }}
          />
          <Typography variant="h4" gutterBottom>
            {review.name}
          </Typography>
          <Typography
            variant="subtitle1"
            color="textSecondary"
            gutterBottom
          >
            {format(
              new Date(review.createdAt),
              'yyyy-MM-dd HH:mm:ss',
              { locale: ru }
            )}{' '}
            by {review.author_id.name}
          </Typography>
          <Typography>
            <ReactMarkdown>
            {review.text}
            </ReactMarkdown>
          </Typography>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
        <Box display="flex" alignItems="center" mt={1}>
        <Typography
        sx={{
        }}

        >{t('piece')}: {review.piece.name}</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', ml: 1 }}>
            <Rating
                name={`user-rating-${review._id}`}
                value={calculateAverageRating(review.piece.notes)}
                readOnly={!user}
                precision={0.5}
                onChange={(event, newValue) => handleUserRatingChange(review._id, newValue)}
            />
            <Typography>{calculateAverageRating(review.piece.notes)}</Typography>
            <StarIcon fontSize="small" color="primary"></StarIcon>
            <PeopleAltOutlined fontSize="small" style={{ marginLeft: 5 }} />
            <Typography variant="body2">{review.piece.notes.length}</Typography>
          </Box>
        </Box>
            <Typography
              variant="body1"
              color="textSecondary"
              style={{
                marginLeft: 'auto',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {review.likes.length}{' '}
              <ThumbUpIcon
                fontSize="small"
                style={{ marginRight: 5 }}
              />
              {review.comments.length}{' '}
              <CommentOutlinedIcon
                fontSize="small"
                style={{ marginRight: 5 }}
              />
            </Typography>
          </div>
          </div>
            <Button onClick={() => toPDF()} startIcon={<PictureAsPdfIcon></PictureAsPdfIcon>} variant="outlined"> {t('pdf')} </Button>
          <Typography sx={{padding:1}} variant="h5" gutterBottom>
            Comments:
          </Typography>
          {comments.length === 0 ? (
            <Typography sx={{padding: 1}} variant="body1">
              Оставьте первый комментарий!
            </Typography>
          ) : (
            comments.map((comment, index) => (
              <Box key={index} sx={{ marginBottom: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: 1,
                  }}
                >
                  <Avatar src={comment.user_id.photo_url} sx={{ marginRight: 1 }}>
                  </Avatar>

                  <Typography variant="subtitle2" color="textSecondary">
                    {comment.user_id.name} -{' '}
                    {format(new Date(comment.createdAt), 'yyyy-MM-dd HH:mm:ss', {
                      locale: ru,
                    })}
                  </Typography>
                </Box>
                <Typography variant="body1" paragraph>
                  {comment.text}
                </Typography>
              </Box>
            ))
          )}

        {user ? (
          <Box marginTop={2}>
            <Typography variant="h5" gutterBottom>
              Add Comment
            </Typography>
            <TextField
              multiline
              rows={1}
              fullWidth
              variant="outlined"
              label="Your Comment"
              value={newComment}
              onChange={event => setNewComment(event.target.value)}
              style={{ marginBottom: 10 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleCommentSubmit}
            >
              Send Comment
            </Button>
          </Box>
        ) : (
          <Typography variant="body1" color="textSecondary">
            Please log in to leave a comment.
          </Typography>
        )}

        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ReviewPage;
