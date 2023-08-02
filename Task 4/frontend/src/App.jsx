import { useEffect, useState } from 'react'
import './App.css'
import Application from './components/Application'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import PrivateRoute from './components/PrivateRoute.jsx';
const users = [
  { id: 1, name: 'Alex', email: 'laptonik322@mail.ru', registration_date: '2023-07-31', last_login_date: '2023-07-31', status: 'Active' },
  { id: 2, name: 'Alice', email: 'laptonik321@mail.ru', registration_date: '2023-02-31', last_login_date: '2023-07-31', status: 'Active' },
  { id: 3, name: 'Vladimir', email: 'laptonik325@mail.ru', registration_date: '2023-03-35', last_login_date: '2023-07-31', status: 'Active' },
  { id: 4, name: 'Ksenia', email: 'laptonik3@mail.ru', registration_date: '2023-07-31', last_login_date: '2023-07-31', status: 'Active' },
  { id: 5, name: 'Max', email: 'laptonik3122@mail.ru', registration_date: '2023-01-32', last_login_date: '2023-07-31', status: 'Active' }


]


function getUsers() {
  users.forEach((user) => {
    user.checked = false
  })
  return users
}

function App() {
  const [users, setUsers] = useState(() => getUsers())
  const [loggedUser, setLoggedUser] = useState(() => localStorage.getItem('username'))

  const setCheckBox = (id) => {
    setUsers(users.map((user) => {
      return user.id === id ? { ...user, checked: !user.checked } : user
    }))

  }


  const banUsers = () => {
    setUsers(users.map((user) => {
      return user.checked === true ? { ...user, status: 'Blocked' } : user
    }))


  }

  const unBanUsers = () => {
    setUsers(users.map((user) => {
      return user.checked === true ? { ...user, status: 'Active' } : user
    }))

  }
  const deleteUsers = () => {
    setUsers(users.filter((user) => {
      return user.checked === false
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

      {/* <NavBar></NavBar>
      <DashBoard setStatusAllUsers={setStatusAllUsers} deleteUsers={deleteUsers} unBanUsers={unBanUsers} banUsers={banUsers} setCheckBox={setCheckBox} users={users}></DashBoard> */}
      <Router>
        <Routes>
          <Route element={<PrivateRoute></PrivateRoute>}>
            <Route exact path='/' element={<Application loggedUser={loggedUser} setStatusAllUsers={setStatusAllUsers} deleteUsers={deleteUsers} unBanUsers={unBanUsers} banUsers={banUsers} setCheckBox={setCheckBox} users={users}></Application>}></Route>
          </Route>

          <Route path='/login' element={<LoginForm setLoggedUser={setLoggedUser}></LoginForm>}></Route>

        </Routes>
      </Router>
    </>
  )
}

export default App
