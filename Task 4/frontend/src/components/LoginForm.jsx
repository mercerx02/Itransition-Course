import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

const LoginForm = ({ setLoggedUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()
    const cookies = new Cookies();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json()
        if (response.ok) {
            if(!data.is_banned){
                cookies.set('jwtToken', data.token, { path: '/' });

                await fetch('http://localhost:5000/api/users/', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${cookies.get('jwtToken')}`,

                    },
                    body: JSON.stringify({id:data._id, action: 'date' }),
                });
            setLoggedUser(data.name)
            localStorage.setItem('username', data.name)
            navigate('/')
            }
            else{
                alert('Вы заблокированны!')
            }

        }
        else {
            alert('Неправильный логин или пароль!')
        }


    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Вход в аккаунт</h5>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email адрес</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        placeholder="Введите ваш email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Пароль</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        placeholder="Введите пароль"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">Войти</button>
                            </form>
                        </div>
                    </div>
                    <div className="mt-3 text-center">
                        <p>Нет аккаунта? <a href="/register">Зарегистрируйтесь</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
