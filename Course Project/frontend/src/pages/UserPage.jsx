import React, { useEffect, useState } from 'react';
import Reviews from '../components/Reviews';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import ArticleIcon from '@mui/icons-material/Article';
import { Chip } from '@mui/material';
import { useTranslation } from "react-i18next";
import { useLocation} from 'react-router-dom';
import { getReviewsByUserId } from '../services/reviewsService';
import { getUserById } from '../services/usersService';

const UserPage = ({ endIndex, startIndex, searchResults, me, adminMode}) => {
  const [reviews, setReviews] = useState([]);
  const [totalLikes, setTotalLikes] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.pathname.split('/')[2];
  const [user, setUser] = useState(null)
  const {t} = useTranslation()


  useEffect(()=>{
    getReviewsByUserId(userId)
    .then((res)=>{
      if(res.data){
        setReviews(res.data.reviews);
        const likes = res.data.reviews.reduce(
          (total, review) => total + review.likes.length,
          0
        );
        setTotalLikes(likes)
      }
    })
    .catch((error)=>{
      console.log(error)
    })

  },[])

  useEffect(() => {
    getUserById(userId)
      .then((res) => {
          setUser(res)
      });
  }, []);


  return (
    <div style={{ padding: '16px' }}>
      {user && (
        <Card style={{ marginBottom: '16px' }}>
          <CardHeader
            title={
            <Typography variant="h5">{ me && user._id === me._id ? t('my profile'): `${user.name}'s profile`} {user.is_admin && <Chip key='admin' label='admin' color="success"></Chip>}</Typography>
          }
          />
          <CardContent>
            <Typography variant="body1" gutterBottom>
              <strong>{t('total likes')}:</strong> {totalLikes}
            </Typography>
          </CardContent>
        </Card>
      )}
      <Reviews
        endIndex={endIndex}
        startIndex={startIndex}
        user={user}
        reviews={reviews}
        setReviews={setReviews}
        searchResults={searchResults}
        reviews_name={t('my_reviews')}
      />
      {user && me && (user._id === me._id || adminMode) && (
        <SpeedDial
          title='New review'
          ariaLabel="SpeedDial basic example"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          icon={<SpeedDialIcon icon={<ArticleIcon />} />}
          onClick={() => navigate(`/user/${user._id}/create`)}
        >
        </SpeedDial>
      )}
    </div>
  );
};

export default UserPage;
