import { BACKEND_URL } from "../const"
import axios from 'axios'


export const submitComment = async (id, comment) => {
    try {
        const response = await axios.post(
            `${BACKEND_URL}/api/reviews/${id}/comments`,
            { text: comment },
            { withCredentials: true }
            );
        return response.data.review

    } catch (error) {
        console.log(error)

    }

}
