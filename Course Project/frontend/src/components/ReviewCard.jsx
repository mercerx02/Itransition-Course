import React from 'react'
import { ratePiece } from '../services/pieceService';
import { likeReview } from '../services/reviewsService';
import { calculateAverageRating } from '../services/calculateAvgRating';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale'
import { PeopleAltOutlined } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Box, Card, CardContent, CardMedia, Chip, Typography, IconButton, Rating, Select, MenuItem, Avatar, Grid} from '@mui/material';
import { useTranslation } from "react-i18next";
import StarIcon from '@mui/icons-material/Star';


const ReviewCard = ({user, review, reviews, setReviews}) => {
    const { t } = useTranslation();

    const handleUserRatingChange = async (reviewId, newValue) => {
        try {
          const updatedReview = await ratePiece(reviewId, newValue)
          setReviews(reviews.map((review)=>{
            return review._id === updatedReview._id ? updatedReview : review
          }))
        } catch (error) {

        }

      };

      const handleLikeClick = async (reviewId) => {
        try {
          const response = await likeReview(reviewId)

          if (response.data && response.data.review) {
            const updatedReview = response.data.review;
            setReviews(reviews.map((review)=>{
              return review._id === updatedReview._id ? updatedReview : review
            }))
          }
        } catch (error) {
          console.error(error);
        }
      };


  return (
    <>
    <Card key={review._id} sx={{ mb: 2,boxShadow: 18, transform: 'translateY(0)',transition: 'transform 0.2s ease', '&:hover': {
      transform: 'translateY(-4px)', }, borderRadius: 8 , minHeight: 400, maxHeight:600, minWidth:350}}>
        <Link to={`/review/${review._id}`} style={{ textDecoration: 'none' }}>
        <CardMedia
            component="img"
            height="200"
            width="450"
            image={review.photo_url}
            alt={review.name}
        />
        </Link>
        <CardContent>
        <Typography variant="h5" gutterBottom sx={{
          fontSize: '1.25rem',
          color: 'primary',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '400px',
          }}>
            {review.name}
        </Typography>
        <Box
            display="flex"
            alignItems="center"
            marginBottom={2}
        >
            <Link to={`/user/${review.author_id._id}`} style={{ textDecoration: 'none' }} >
            <Avatar  alt={review.author_id.name} src={review.author_id.photo_url} sx={{ marginRight: 1, width:35, height:35 }}></Avatar>
            </Link>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            {review.author_id.name} - {format(new Date(review.createdAt), "yyyy-MM-dd HH:mm:ss", { locale: ru })}
            </Typography>
        </Box>
        <Box display="flex" alignItems="center" mt={1}>
        <Typography
        sx={{
          color: 'primary',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '400px',
        }}

        >{t('piece')}: {review.piece.name}</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', ml: 1 }}>
            <Typography>{calculateAverageRating(review.piece.notes)}</Typography>
            <StarIcon fontSize="small" color="primary"></StarIcon>
        </Box>
    </Box>

        <Typography variant="body2" color="textSecondary" gutterBottom>
        {t('group')}: {review.group}
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
            {review.tags.map((tag) => (
            <Chip key={tag.value} label={tag.value} variant="outlined" />
            ))}
        </Box>
        <Box display="flex" alignItems="center" mt={1}>
            <Typography mr={1}>{t("author's rating")}:</Typography>
            <StarIcon fontSize="small" color="primary" />
            <Typography variant="body1" ml={1}>
            {review.author_note}/10
            </Typography>
        </Box>
        <Box display="flex" alignItems="center" mt={1}>
            <IconButton
            size="small"
            onClick={() => handleLikeClick(review._id)}
            disabled={!user}
            >
            {user && review.likes.some(like => like._id === user._id) ? (
                <FavoriteIcon color="error" />
            ) : (
                <FavoriteBorderIcon />
            )}
            </IconButton>
            <Typography variant="body1">
            {review.likes.length}
            </Typography>
            <IconButton size="small" sx={{ ml: 2 }}>
            <CommentIcon />
            </IconButton>
            <Typography variant="body1">
            {review.comments.length}
            </Typography>
        </Box>
        </CardContent>
    </Card>
    </>
  )
}

export default ReviewCard
