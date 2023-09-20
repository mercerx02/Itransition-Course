import { BACKEND_URL } from "../const"
import axios from 'axios'


export const getMe = async () =>{
    try {
        const response = await axios.get(`${BACKEND_URL}/auth/user/me`, {withCredentials: true})
        return response.data.user

    } catch (error) {
        console.log(error)

    }
}

export const getUserById = async (userId) =>{
    try {
        const response = await axios.get(`${BACKEND_URL}/api/users/${userId}`, { withCredentials: true })
        return response.data.user

    } catch (error) {
        console.log(error)

    }
}

export const getUsers = async () => {
    try {
       const response = await axios.get(`${BACKEND_URL}/api/users`, { withCredentials: true })
       return response.data.users

    } catch (error) {
        console.log(error)

    }
}

export const blockUserById = async (id) => {
    try {
       const response = await axios.put(`${BACKEND_URL}/api/users/${id}/block`, { withCredentials: true })
       return response

    } catch (error) {
        console.log(error)

    }
}

export const unBlockUserById = async (id) => {
    try {
       const response = await axios.put(`${BACKEND_URL}/api/users/${id}/unblock`, { withCredentials: true })
       return response

    } catch (error) {
        console.log(error)

    }
}

export const deleteUserById = async (id) => {
    try {
       const response = await axios.delete(`${BACKEND_URL}/api/users/${id}`, { withCredentials: true })
       return response

    } catch (error) {
        console.log(error)

    }
}


export const changeUserRoleById = async (userId) => {
    try {
        const response = await axios.put(`${BACKEND_URL}/api/users/${userId}`, { withCredentials: true })
        return response
    } catch (error) {
        console.log(error)

    }

}
