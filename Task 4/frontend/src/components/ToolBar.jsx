import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

const ToolBar = ({ users, setUsers, loggedUser }) => {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const updateUserStatus = async (user, action) => {
    let updatedUser = { ...user };

    if (user.checked) {
      const requestOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookies.get('jwtToken')}`, // Ваш токен авторизации

        },
      };

      if (action === 'block') {
        await fetch(`http://localhost:5000/api/users`, {
          ...requestOptions,
          body: JSON.stringify({ id: user._id, action: 'block' }),
        });

        updatedUser.status = 'Blocked';
        if (user.name === loggedUser) {
            localStorage.removeItem('username');
            cookies.remove('jwtToken', { path: '/' });
            navigate('/login');
          }
      } else if (action === 'unban') {
        await fetch(`http://localhost:5000/api/users`, {
          ...requestOptions,
          body: JSON.stringify({ id: user._id, action: 'unban' }),
        });

        updatedUser.status = 'Active';
      } else if (action === 'delete') {
        await fetch(`http://localhost:5000/api/users`, {
          ...requestOptions,
          method: 'DELETE',
          body: JSON.stringify({ id: user._id }),
        });

        if (user.name === loggedUser) {
          localStorage.removeItem('username');
          cookies.remove('jwtToken', { path: '/' });
          navigate('/login');
        }

        updatedUser = null;
      }
    }

    return updatedUser;
  };

  const handleUserAction = async (action) => {
    const updatedUsers = await Promise.all(users.map(async (user) => {
      const updatedUser = await updateUserStatus(user, action);
      return updatedUser || user;
    }));

    setUsers(updatedUsers.filter(Boolean));
  };

  return (
    <>
      <div className="row mb-3">
        <div className="col">
          <button onClick={() => handleUserAction('block')} className="btn btn-primary me-2 btn-warning" id="blockBtn">Block</button>
          <button onClick={() => handleUserAction('unban')} className="btn btn-primary me-2 btn-success" id="unblockBtn">Unblock</button>
          <button onClick={() => handleUserAction('delete')} className="btn btn-danger" id="deleteBtn"><i className="bi bi-trash"></i> Delete</button>
        </div>
      </div>
    </>
  );
}

export default ToolBar;
