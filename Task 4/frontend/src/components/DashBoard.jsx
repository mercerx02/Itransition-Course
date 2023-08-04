import React from 'react'
import Table from './Table'
import ToolBar from './ToolBar'

const DashBoard = ({ users, setCheckBox, setStatusAllUsers, setUsers, loggedUser }) => {
    return (
        <>
            <div className="container mt-4">
                <ToolBar loggedUser={loggedUser} setUsers={setUsers} users={users}></ToolBar>
                <Table setStatusAllUsers={setStatusAllUsers} setCheckBox={setCheckBox} users={users}></Table>
            </div>

        </>
    )
}

export default DashBoard
