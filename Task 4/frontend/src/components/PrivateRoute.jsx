import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Cookies from 'universal-cookie';



const PrivateRoute = () => {
    const cookies = new Cookies()
    const jwt_token = cookies.get('jwtToken')
    const [verificationStatus, setVerificationStatus] = useState('pending');
    const navigate = useNavigate()
    useEffect(() => {
        fetch(`${process.env.API_URL}/api/users/verify`, {
            method: 'POST',
            headers: {
                Authorization: jwt_token,
            },
        })
        .then(response => {
            if(response.ok){
                setVerificationStatus('verified')
            }
            else{
                throw new Error('Ошибка')
            }
        })
        .catch((error) => {
            navigate('/login')
        });
    }, []);

    if (verificationStatus === 'pending') {
    } else if (verificationStatus === 'verified') {
        return <Outlet />;
    } else {
        return <Navigate to="/login" />;
    }


};

export default PrivateRoute;
