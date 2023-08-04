import { useEffect, useState } from 'react'
import './App.css'
import Application from './components/Application'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LoginForm from './components/LoginForm';
import PrivateRoute from './components/PrivateRoute.jsx';
import Register from './components/Register';
import Cookies from 'universal-cookie';




function App() {
  const [users, setUsers] = useState([])
  const [loggedUser, setLoggedUser] = useState(() => localStorage.getItem('username'))
  const cookies = new Cookies()

  useEffect(() => {
    const fetchUsers = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/users', {
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





  const setCheckBox = (id) => {
    setUsers(users.map((user) => {
      return user._id === id ? { ...user, checked: !user.checked } : user
    }))

  }



  const setStatusAllUsers = (flag) => {
    console.log(flag)
    if (flag) {
      setUsers(users.map((user) => {
        return { ...user, checked: true }
      }))
    }
    else {
      setUsers(users.map((user) => {
        return { ...user, checked: false }
      }))

    }

  }
  return (
    <>

      <Router>
        <Routes>
          <Route element={<PrivateRoute></PrivateRoute>}>
            <Route exact path='/' element={<Application setUsers={setUsers} loggedUser={loggedUser} setStatusAllUsers={setStatusAllUsers}  setCheckBox={setCheckBox} users={users}></Application>}></Route>
          </Route>

          <Route path='/login' element={<LoginForm setLoggedUser={setLoggedUser}></LoginForm>}></Route>
          <Route path='/register' element={<Register></Register>}></Route>

        </Routes>
      </Router>
    </>
  )
}

export default App
