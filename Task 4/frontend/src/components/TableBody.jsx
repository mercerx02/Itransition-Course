import React from 'react'
import TableRow from './TableRow'

const TableBody = ({ users, setCheckBox }) => {
    return (
        <>
            <tbody>
                {users.map((user) => {
                    return <TableRow setCheckBox={setCheckBox} key={user._id} user={user}></TableRow>
                })}

            </tbody>
        </>
    )
}

export default TableBody
