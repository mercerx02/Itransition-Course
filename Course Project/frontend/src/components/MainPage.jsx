import React from 'react';
import { Box, Card, CardContent, CardMedia, Chip, Typography, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';

import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import StarIcon from '@mui/icons-material/Star';
import { TagCloud } from 'react-tagcloud';


const MainPage = ({tags, reviews}) => {
  return (

    <Box p={10} display="flex">
      <Box maxWidth={800} sx={{ paddingRight: 8 }} >
      <Typography variant="h3" mb={2}>
          Обзоры
        </Typography>
        {reviews.map((review) => (
          <Card key={review.id} sx={{ mb: 2, paddingLeft: 2, boxShadow: 18 }}>
            <Link to={`/review/${review.id}`} style={{ textDecoration: 'none' }}>
            <CardMedia
              component="img"
              height="400"
              image={review.image}
              alt={review.title}
            />
            </Link>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {review.title}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                {review.user} - {review.date}
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                {review.tags.map((tag) => (
                  <Chip key={tag} label={tag} variant="outlined" />
                ))}
              </Box>
              <Box display="flex" alignItems="center" mt={1}>
                <StarIcon fontSize="small" color="primary" />
                <Typography variant="body1" ml={1}>
                  {review.rating}/10
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" mt={1}>
                <IconButton size="small">
                  <FavoriteIcon />
                </IconButton>
                <Typography variant="body1">
                  {review.likes}
                </Typography>
                <IconButton size="small" sx={{ ml: 2 }}>
                  <ChatBubbleOutlineIcon />
                </IconButton>
                <Typography variant="body1">
                  {review.comments}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
      <Box sx={{ paddingTop: 20 }} flexGrow={1} ml={2}>
        <Typography variant="h5" mb={2}>
          Тренды
        </Typography>
        <TagCloud
        tags={tags}
        shuffle={true}
        minSize={12}
        maxSize={35}
        />
      </Box>
    </Box>
  );
};

export default MainPage;
