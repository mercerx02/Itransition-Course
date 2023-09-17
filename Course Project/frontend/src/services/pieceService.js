import { BACKEND_URL } from "../const"
import axios from 'axios'


export const getPieces = async () => {
    try {
        const response = await axios.get(`${BACKEND_URL}/api/pieces`, { withCredentials: true })
        return response.data.pieces

    } catch (error) {
        console.log(error)

    }
}


export const ratePiece = async (reviewId, newValue ) => {
    try {
    const response = await axios.post(
        `${BACKEND_URL}/api/pieces/${reviewId}/rate`,
        { newValue: newValue },
        { withCredentials: true }
        );
    return response.data.review

    } catch (error) {
        console.log(error)
    }

}
