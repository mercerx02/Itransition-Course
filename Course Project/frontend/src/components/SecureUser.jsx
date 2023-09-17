import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { getMe } from '../services/usersService';

const SecureUser = ({setOpenAlert, setAlertMessage}) => {
    const [user, setUser] = useState(null)
    const {t} = useTranslation()

    useEffect(() => {
    getMe()
    .then(result => setUser(result))

    }, []);


    const { id } = useParams()
    if(!user){
    }
    else if((user._id === id || user.is_admin) && !user.is_blocked){

        return <Outlet></Outlet>
    }
    else{
        setAlertMessage(t('block'))
        setOpenAlert(true)
        return <Navigate to='/'/>
    }

}

export default SecureUser
