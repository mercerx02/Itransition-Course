import React from 'react'
import CheckBox from './CheckBox'

const TableRow = ({ user, setCheckBox }) => {
    return (
        <>
            <tr>
                <CheckBox checked={user.checked} user_id={user._id} setCheckBox={setCheckBox}></CheckBox>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.createdAt}</td>
                <td>{user.last_login_date}</td>
                <td>{user.status}</td>
            </tr>

        </>
    )
}

export default TableRow
