import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { useNavigate } from 'react-router-dom';
import { deleteReview } from '../services/reviewsService';
import { useTranslation } from "react-i18next";

const DeleteReviewDialog = ({open, setOpen, reviewId, setAlertMessage, setOpenAlert, setReviews}) => {
    const { t } = useTranslation()

    const navigate = useNavigate()
    const handleClose = () => {
        setOpen(false);
    };
    const handleDeleteReview = async () =>{
        try{
        const response = await deleteReview(reviewId)
        setAlertMessage(t('delete_success'))
        setOpen(false)
        setOpenAlert(true)
        setReviews(prevReviews => prevReviews.filter(review => review._id !== reviewId));
        window.scrollTo(0, 0);
        navigate('/')
        } catch(error){
            console.log(error)
        }
    }
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Вы действительно хотите удалить данный обзор?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>Отмена</Button>
          <Button onClick={handleDeleteReview} autoFocus>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </>


  )
}

export default DeleteReviewDialog
