import { Box, Typography, Grid} from '@mui/material';
import { useEffect, useState } from 'react';
import { calculateAverageRating } from '../services/calculateAvgRating';
import ReviewCard from './ReviewCard';
import { useTranslation } from "react-i18next";
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import SortReviews from './SortReviews';

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
 <Box maxWidth='100%' sx={{ paddingLeft: 3, paddingRight: 20 }}>
  <SortReviews user={user} setSortBy={setSortBy} sortBy={sortBy}></SortReviews>
  <Divider sx={{ marginBottom: 2}}></Divider>
  <Grid container spacing={50}>

      {showNoReviews ? (
        <Grid item key='no reviews' xs={12} sm={6} md={4} lg={3}>

        <Box sx={{ p: 10,paddingLeft:20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Typography Typography variant="h2" mt={4}>
          {t('no_reviews')}
        </Typography>
        </Box>
        </Grid>

      ) : reviews.length === 0 ? (
        <Grid item key='progress' xs={12} sm={6} md={4} lg={3}>

        <Box sx={{ p: 10, paddingLeft: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress size={80} />
        </Box>
        </Grid>

      ) : (

        searchResults.length > 0 ? (
          searchResults.map((review) => (
            <Grid item key={review._id} xs={12} sm={6} md={4} lg={3}>
            <ReviewCard key={review._id} setReviews={setReviews} reviews={reviews} review={review} user={user} />
            </Grid>

          ))
        ) : (
          sortReviews()
            .slice(startIndex, endIndex)
            .map((review) => (
              <Grid item key={review._id} xs={12} sm={6} md={4} lg={3}>
              <ReviewCard key={review._id} setReviews={setReviews} reviews={reviews} review={review} user={user} />
              </Grid>
            ))
        )

      )}
      </Grid>
      </Box>
        </>
      );
}

export default Reviews
