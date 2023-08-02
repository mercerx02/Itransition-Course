import React from 'react'
import DashBoard from './DashBoard'
import NavBar from './NavBar'


const Application = ({ users, setCheckBox, banUsers, unBanUsers, deleteUsers, setStatusAllUsers, loggedUser }) => {
    return (
        <>

            <NavBar loggedUser={loggedUser}></NavBar>
            <DashBoard setStatusAllUsers={setStatusAllUsers} deleteUsers={deleteUsers} unBanUsers={unBanUsers} banUsers={banUsers} setCheckBox={setCheckBox} users={users}></DashBoard>
        </>
    )
}

export default Application
