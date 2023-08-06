import React, { useEffect } from 'react'
import DashBoard from './DashBoard'
import NavBar from './NavBar'
import Cookies from 'universal-cookie';


const Application = ({ users, setCheckBox, setStatusAllUsers, loggedUser , setUsers}) => {
    const cookies = new Cookies()
    useEffect(() => {
      const fetchUsers = async () => {
          try {
            const response = await fetch(`${process.env.API_URL}/api/users`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${cookies.get('jwtToken')}`,
              },
            });
              if (response.ok) {
                  const data = await response.json();
                  data.forEach((user)=>{
                    user.checked = false
                    user.is_banned ? user.status = 'Blocked' : user.status = 'Active'
                  })
                  setUsers(data);

              }
          } catch (error) {
              console.error('Ошибка при загрузке пользователей:', error);
          }
      };

      fetchUsers();
  }, []);

    return (
        <>

            <NavBar loggedUser={loggedUser}></NavBar>
            <DashBoard loggedUser={loggedUser} setUsers={setUsers} setStatusAllUsers={setStatusAllUsers}  setCheckBox={setCheckBox} users={users}></DashBoard>
        </>
    )
}

export default Application
