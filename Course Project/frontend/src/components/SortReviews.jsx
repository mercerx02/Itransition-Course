import React from 'react'
import { Box, Select, MenuItem} from '@mui/material';
import { useTranslation } from "react-i18next";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { ListItemIcon } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

const SortReviews = ({setSortBy, sortBy, user}) => {
    const { t } = useTranslation();

  return (
    <>
  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
    <Box sx={{ padding: 1 }}>
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

    </>
  )
}

export default SortReviews
