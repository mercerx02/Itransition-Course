import { Box, Pagination, Typography, Container} from '@mui/material';
import TagCloudComponent from '../components/TagCloud';
import Reviews from '../components/Reviews';
import { useTranslation } from "react-i18next";
import CircularProgress from '@mui/material/CircularProgress';

const MainPage = ({reviews , user, setReviews ,startIndex, setPage, page, endIndex, itemsPerPage, searchResults}) => {
  const {t} = useTranslation()
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };


  return (
    <>
     <Box sx={{ marginTop:15,display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
     <Typography variant="h3" mb={2} sx={{
      fontSize: '2.5rem',
      fontWeight: 'bold',
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
      }}>
      {t('logo text')} 🙂
    </Typography>
    <Box>
    <Container component="main" sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}} maxWidth="sm">
      <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <Typography component='h1' variant="body2" gutterBottom>
      {t('descr1')}
      {t('descr2')}
      </Typography>
      </Box>
    </Container>
    </Box>

    </Box>
    {reviews.length === 0 ? (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 30,
          paddingBottom:30
        }}
      >
    <CircularProgress size={80} />
    <Typography>{t('fetch reviews')}</Typography>
    </Box>
    ): (
      <Box>
      <Box sx={{ p: 5, paddingLeft:20,display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Reviews reviews_name={t('recomendations')} searchResults={searchResults} endIndex={endIndex} startIndex={startIndex} user={user} reviews={reviews} setReviews={setReviews} ></Reviews>
        </Box>

        <Box  display="flex" justifyContent="center" my={3}>
          <Pagination
            count={Math.ceil(reviews.length / itemsPerPage)}
            page={page}
            onChange={handleChangePage}
            shape="rounded"
            color="primary"
          />
        </Box>
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}} my={3}>
        <TagCloudComponent></TagCloudComponent>
        </Box>
        </Box>
    )}

    </>
  );
};

export default MainPage;
