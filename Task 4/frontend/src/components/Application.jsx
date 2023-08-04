import React from 'react'
import DashBoard from './DashBoard'
import NavBar from './NavBar'


const Application = ({ users, setCheckBox, banUsers, unBanUsers, deleteUsers, setStatusAllUsers, loggedUser , setUsers}) => {
    return (
        <>

            <NavBar loggedUser={loggedUser}></NavBar>
            <DashBoard loggedUser={loggedUser} setUsers={setUsers} setStatusAllUsers={setStatusAllUsers} deleteUsers={deleteUsers} unBanUsers={unBanUsers} banUsers={banUsers} setCheckBox={setCheckBox} users={users}></DashBoard>
        </>
    )
}

export default Application
