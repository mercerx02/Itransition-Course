import axios from 'axios'

import { BACKEND_URL } from '../const'

export const getReviews = async () =>{
    try {
        const response = await axios.get(`${BACKEND_URL}/api/reviews`, {withCredentials: true})
        return response.data.reviews
    } catch (error) {

    }

}

export const getReviewsByUserId = async (userId) =>{
    try {
        const response = await axios.get(
            `${BACKEND_URL}/api/reviews/users/${userId}`,
            { withCredentials: true }
          )
        return response
    } catch (error) {
        console.log(error)

    }

}

export const createReview = async (formData) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/api/reviews`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          });
        return response.data.review
    } catch (error) {
        console.log(error)

    }
}

export const editReview = async (reviewId,formData) => {
    try {
        const response = await axios.put(`${BACKEND_URL}/api/reviews/${reviewId}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          });
        return response.data.review
    } catch (error) {
        console.log(error)

    }
}


export const deleteReview = async (reviewId) => {
    try {
        const response = await axios.delete(`${BACKEND_URL}/api/reviews/${reviewId}`, { withCredentials: true })
        return response
    } catch (error) {
        console.log(error)

    }
}


export const getReviewById = async (id) =>{
    try {
        const response =  await axios.get(`${BACKEND_URL}/api/reviews/${id}`, { withCredentials: true })
        return response.data.review
    } catch (error) {
        console.log(error)
    }

}

export const getReviewsByTag = async (tag) =>{
    try {
        const response = await axios.get(`${BACKEND_URL}/api/reviews/tags/${tag}`, {withCredentials: true})
        return response.data.reviews
    } catch (error) {
        console.log(error)
    }

}

export const likeReview = async (reviewId) =>{
    try {
        const response = await axios.post(`${BACKEND_URL}/api/reviews/${reviewId}/like`, null, { withCredentials: true });
        return response
    } catch (error) {
        console.log(error)
    }

}
