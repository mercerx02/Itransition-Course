import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

const Navbar = ({ loggedUser }) => {
    const cookies = new Cookies();

    const navigate = useNavigate()
    const logOut = () => {
        localStorage.removeItem('username')
        cookies.remove('jwtToken', { path: '/' });

        navigate('/login')

    }
    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">Task 4</a>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="#">{loggedUser}</a>
                        </li>
                        <li className="nav-item">
                            <a onClick={() => logOut()} className="nav-link" href="#">Log Out</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
