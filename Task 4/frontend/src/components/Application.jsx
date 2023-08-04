import React from 'react'
import DashBoard from './DashBoard'
import NavBar from './NavBar'


const Application = ({ users, setCheckBox, setStatusAllUsers, loggedUser , setUsers}) => {
    return (
        <>

            <NavBar loggedUser={loggedUser}></NavBar>
            <DashBoard loggedUser={loggedUser} setUsers={setUsers} setStatusAllUsers={setStatusAllUsers}  setCheckBox={setCheckBox} users={users}></DashBoard>
        </>
    )
}

export default Application
