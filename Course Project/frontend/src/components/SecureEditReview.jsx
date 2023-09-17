import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { getMe } from '../services/usersService';
import { getReviewById } from '../services/reviewsService';

const SecureEditReview = ({setAlertMessage, setOpenAlert}) => {
    const [review, setReview] = useState(null);
    const [user, setUser] = useState(null)
    const {id} = useParams()
    const {t} = useTranslation()

    useEffect(() => {
      getReviewById(id)
      .then(result => setReview(result))
    }, []);;

      useEffect(() => {
        getMe()
        .then(result => setUser(result))

      }, []);

      if(!user || !review){

      }
      else if(user._id === review.author_id._id || user.is_admin){
        return <Outlet></Outlet>

      } else{
        setAlertMessage(t('not_your_review'))
        setOpenAlert(true)
        return <Navigate to='/'/>

      }
}

export default SecureEditReview
