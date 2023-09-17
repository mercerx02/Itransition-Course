import React, { useEffect, useState } from 'react'
import MainPage from './MainPage'
import { useParams } from 'react-router-dom';
import { getReviewsByTag } from '../services/reviewsService';

const FilterPage = ({user, startIndex, setPage, page, endIndex, itemsPerPage, searchResults}) => {
    const [reviews, setReviews] = useState([])
    const { tag } = useParams();

    useEffect(()=>{
        getReviewsByTag(tag)
        .then((res)=>{
            setReviews(res);
        })
        .catch((error)=>{
          console.log(error)
        })

      },[])


  return (
    <MainPage searchResults={searchResults} setPage={setPage} endIndex={endIndex} startIndex={startIndex} page={page} itemsPerPage={itemsPerPage} user={user} reviews={reviews} setReviews={setReviews}></MainPage>
  )
}

export default FilterPage
