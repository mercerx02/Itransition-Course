import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import StarIcon from '@mui/icons-material/Star';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale'
import { PeopleAltOutlined } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Box, Card, CardContent, CardMedia, Chip, Typography, IconButton, Rating, Select, MenuItem, Avatar} from '@mui/material';
import { useState } from 'react';
import { ListItemIcon } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { useTranslation } from "react-i18next";
import { ratePiece } from '../services/pieceService';
import { likeReview } from '../services/reviewsService';
import { calculateAverageRating } from '../services/calculateAvgRating';
const Reviews = ({reviews, user, setReviews, startIndex, endIndex, searchResults}) => {
  const [sortBy, setSortBy] = useState('date');
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

      const sortReviews = () => {
        if (sortBy === 'date') {
          return [...reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortBy === 'likes') {
          return [...reviews].sort((a, b) => b.likes.length - a.likes.length);
        } else if (sortBy === 'averageRating') {
          return [...reviews].sort((a, b) => {
            const avgRatingA = calculateAverageRating(a.piece.notes);
            const avgRatingB = calculateAverageRating(b.piece.notes);
            return avgRatingB - avgRatingA;
          });
        } else if (sortBy === 'myLikedPosts') {
          return [...reviews].filter((review) =>
            review.likes.some((like) => like._id === user._id)
          );
        }
        return reviews;
      };

      return (
        <>
          <Box maxWidth={1000} sx={{ paddingRight: 20 }}>
            <Typography variant="h3" mb={2}>
              {t('recomendations')}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Box sx={{ padding: '8px' }}>
                <Select
                  label="Сортировать по"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="date">
                    <ListItemIcon>
                      <CalendarTodayIcon fontSize="small" />
                    </ListItemIcon>
                    {t('recent')}
                  </MenuItem>
                  <MenuItem value="averageRating">
                    <ListItemIcon>
                      <StarIcon fontSize="small" />
                    </ListItemIcon>
                    {t('by_avg_rating')}
                  </MenuItem>
                  <MenuItem value="likes">
                    <ListItemIcon>
                      <ThumbUpIcon fontSize="small" />
                    </ListItemIcon>
                    {t('likes')}
                  </MenuItem>
                </Select>
              </Box>
            </Box>
            {searchResults.length > 0 ? (
              searchResults.map((review) => (
                <Card key={review._id} sx={{ mb: 2, paddingLeft: 2, boxShadow: 18 }}>
                  <Link to={`/review/${review._id}`} style={{ textDecoration: 'none' }}>
                    <CardMedia
                      component="img"
                      height="500"
                      width="500"
                      image={review.photo_url}
                      alt={review.name}
                    />
                  </Link>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {review.name}
                    </Typography>
                    <Box
                      display="flex"
                      alignItems="center"
                      marginBottom={2}
                    >
                      <Avatar  alt={review.author_id.name} src={review.author_id.photo_url} sx={{ marginRight: 1, width:35, height:35 }}></Avatar>
                      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                        {review.author_id.name} - {format(new Date(review.createdAt), "yyyy-MM-dd HH:mm:ss", { locale: ru })}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {t('piece')}: {review.piece.name}
                    </Typography>
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
                        <ChatBubbleOutlineIcon />
                      </IconButton>
                      <Typography variant="body1">
                        {review.comments.length}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mt={1}>
                      <Typography>{t('piece rating')}</Typography>
                      <Rating name={`user-rating-${review._id}`} value={calculateAverageRating(review.piece.notes)} readOnly={!user} precision={0.5} onChange={(event, newValue) => handleUserRatingChange(review._id, newValue)} />
                      <Typography>{calculateAverageRating(review.piece.notes)}</Typography>
                      <PeopleAltOutlined fontSize="small" style={{ marginLeft: 5 }} />
                      <Typography variant="body2">{review.piece.notes.length}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))
            ) : (
              sortReviews()
                .slice(startIndex, endIndex)
                .map((review) => (
                  <Card key={review._id} sx={{ mb: 2, paddingLeft: 2, boxShadow: 18 }}>
                    <Link to={`/review/${review._id}`} style={{ textDecoration: 'none' }}>
                      <CardMedia
                        component="img"
                        height="500"
                        width="500"
                        image={review.photo_url}
                        alt={review.name}
                      />
                    </Link>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {review.name}
                      </Typography>
                      <Box
                      display="flex"
                      alignItems="center"
                      marginBottom={2}
                    >
                      <Avatar  alt={review.author_id.name} src={review.author_id.photo_url} sx={{ marginRight: 1, width:35, height:35 }}></Avatar>
                      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                        {review.author_id.name} - {format(new Date(review.createdAt), "yyyy-MM-dd HH:mm:ss", { locale: ru })}
                      </Typography>
                    </Box>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                      {t('piece')}: {review.piece.name}
                      </Typography>
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
                          <ChatBubbleOutlineIcon />
                        </IconButton>
                        <Typography variant="body1">
                          {review.comments.length}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" mt={1}>
                        <Typography>{t('piece rating')}</Typography>
                        <Rating name={`user-rating-${review._id}`} value={calculateAverageRating(review.piece.notes)} readOnly={!user} precision={0.5} onChange={(event, newValue) => handleUserRatingChange(review._id, newValue)} />
                        <Typography>{calculateAverageRating(review.piece.notes)}</Typography>
                        <PeopleAltOutlined fontSize="small" style={{ marginLeft: 5 }} />
                        <Typography variant="body2">{review.piece.notes.length}</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))
            )}
          </Box>
        </>
      );

}

export default Reviews
