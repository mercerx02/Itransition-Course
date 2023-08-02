import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

const PrivateRoute = () => {
    const token = localStorage.getItem('token')
    const cookies = new Cookies()
    console.log('Токен из кук: ', cookies.get('jwtToken'))

    return (
        token ? <Outlet></Outlet> : <Navigate to="/login"></Navigate>
    )


};

export default PrivateRoute;
