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
        <Route Route path="/" element={<PrivateRoute />}>
        <Route index element={<Application setUsers={setUsers} loggedUser={loggedUser} setStatusAllUsers={setStatusAllUsers} setCheckBox={setCheckBox} users={users} />} />
          </Route>

          <Route path='/login' element={<LoginForm setLoggedUser={setLoggedUser}></LoginForm>}></Route>
          <Route path='/register' element={<Register></Register>}></Route>

        </Routes>
      </Router>
    </>
  )
}

export default App
