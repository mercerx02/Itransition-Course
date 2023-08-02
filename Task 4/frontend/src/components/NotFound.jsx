import React from 'react';

const NotFoundPage = () => {
    return (
        <div className="container text-center mt-5">
            <h1 className="display-1">404</h1>
            <p className="lead">Страница, которую вы ищете, не может быть найдена.</p>
            <p>Вернитесь на <a href="/" className="text-primary">главную страницу</a>.</p>
        </div>
    );
}

export default NotFoundPage;
