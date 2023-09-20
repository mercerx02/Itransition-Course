import StarIcon from '@mui/icons-material/Star';
import { Box, Typography, Select, MenuItem,} from '@mui/material';
import { useEffect, useState } from 'react';
import { ListItemIcon } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { calculateAverageRating } from '../services/calculateAvgRating';
import ReviewCard from './ReviewCard';
import { useTranslation } from "react-i18next";
import CircularProgress from '@mui/material/CircularProgress';
import FavoriteIcon from '@mui/icons-material/Favorite';


const Reviews = ({reviews, user, setReviews, startIndex, endIndex, searchResults, reviews_name}) => {
  const [sortBy, setSortBy] = useState('date');
  const { t } = useTranslation();
  const [showNoReviews, setShowNoReviews] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (reviews.length > 0) {
        clearTimeout(timer);
      }else{
        setShowNoReviews(true);

      }
    }, 5000);


    return () => {
      clearTimeout(timer);
    };
  }, [reviews]);

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
 <Box maxWidth={1000} sx={{ paddingLeft: 3, paddingRight: 25 }}>
  <Typography variant="h3" mb={2}>
    {reviews_name}
  </Typography>
  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
    <Box sx={{ padding: 2 }}>
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
        {user &&
        <MenuItem value="myLikedPosts">
        <ListItemIcon>
          <FavoriteIcon fontSize="small" />
        </ListItemIcon>
        {t('liked_reviews')}
      </MenuItem>
      }
      </Select>
    </Box>
  </Box>
      {showNoReviews ? (
        <Typography sx={{padding:5, paddingRight:50}} variant="h2" mt={4}>
          {t('no_reviews')}
        </Typography>
      ) : reviews.length === 0 ? (
        <Box sx={{ display: 'flex', padding: 10, paddingRight: 60 }}>
          <CircularProgress size={80} />
        </Box>
      ) : (
        searchResults.length > 0 ? (
          searchResults.map((review) => (
            <ReviewCard key={review._id} setReviews={setReviews} reviews={reviews} review={review} user={user} />
          ))
        ) : (
          sortReviews()
            .slice(startIndex, endIndex)
            .map((review) => (
              <ReviewCard key={review._id} setReviews={setReviews} reviews={reviews} review={review} user={user} />
            ))
        )
      )}
      </Box>
        </>
      );

}

export default Reviews
