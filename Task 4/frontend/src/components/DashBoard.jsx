import React from 'react'
import Table from './Table'
import ToolBar from './ToolBar'

const DashBoard = ({ users, setCheckBox, banUsers, unBanUsers, deleteUsers, setStatusAllUsers }) => {
    return (
        <>
            <div className="container mt-4">
                <ToolBar deleteUsers={deleteUsers} unBanUsers={unBanUsers} banUsers={banUsers}></ToolBar>
                <Table setStatusAllUsers={setStatusAllUsers} setCheckBox={setCheckBox} users={users}></Table>
            </div>

        </>
    )
}

export default DashBoard
