import { Box, Pagination} from '@mui/material';
import TagCloudComponent from '../components/TagCloud';
import Reviews from '../components/Reviews';
import { useTranslation } from "react-i18next";

const MainPage = ({reviews , user, setReviews ,startIndex, setPage, page, endIndex, itemsPerPage, searchResults}) => {
  const {t} = useTranslation()
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };


  return (
    <>
      <Box p={5} display="flex">
        <Reviews reviews_name={t('recomendations')} searchResults={searchResults} endIndex={endIndex} startIndex={startIndex} user={user} reviews={reviews} setReviews={setReviews} ></Reviews>
        <TagCloudComponent></TagCloudComponent>
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
    </>
  );
};

export default MainPage;
