import { BACKEND_URL } from "../const"
import axios from 'axios'


export const getTags = async () =>{
    try {
        const response = await axios.get(`${BACKEND_URL}/api/tags`, {withCredentials: true})
        return response.data.tags
    } catch (error) {

    }

}
