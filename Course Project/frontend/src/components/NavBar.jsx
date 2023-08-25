import React, { useState } from 'react';

const NavBar = ({ user }) => {
  const [theme, setTheme] = useState('light');

  const handleThemeToggle = () => {
    const html = document.querySelector('html');
    const newTheme = html.dataset.bsTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    html.dataset.bsTheme = newTheme;
  };

  return (
    <nav className="navbar navbar-expand-lg border-bottom">
      <div className="container">
        <div className="navbar-brand">
          <img src="logo.png" alt="Логотип сайта" width="30" height="30" className="d-inline-block align-text-top" />
          <span className="site-name">Сайт рекомендаций</span>
        </div>
        <div className="ml-auto">
          {user ? (
            <div className="d-flex align-items-center">
              <span className="me-3">{user.username}</span>
              <img src={user.avatar} alt="Аватар" width="30" height="30" className="rounded-circle me-2" />
              <button className="btn btn-outline-primary btn-sm me-2">Log Out</button>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" id="themeSwitch" onChange={handleThemeToggle} />
                <label className="form-check-label" htmlFor="themeSwitch">
                  {theme === 'dark' ? (
                    <span className="material-icons" style={{ fontSize: '24px' }}>nights_stay</span>
                  ) : (
                    <span className="material-icons" style={{ fontSize: '24px' }}>wb_sunny</span>
                  )}
                </label>
              </div>
            </div>
          ) : (
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" id="themeSwitch" onChange={handleThemeToggle} />
              <label className="form-check-label" htmlFor="themeSwitch">
                {theme === 'dark' ? (
                  <span className="material-icons" style={{ fontSize: '24px' }}>nights_stay</span>
                ) : (
                  <span className="material-icons" style={{ fontSize: '24px' }}>wb_sunny</span>
                )}
              </label>
              <a href='/login' className="btn btn-outline-primary btn-sm ms-2">Log In</a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
