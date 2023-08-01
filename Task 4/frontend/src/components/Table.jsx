import React from 'react'
import TableBody from './TableBody'
import TableHeadings from './TableHeadings'

const Table = ({ users, setCheckBox, setStatusAllUsers }) => {
    return (
        <>
            <table className="table table-bordered table-striped">
                <TableHeadings setStatusAllUsers={setStatusAllUsers}></TableHeadings>
                <TableBody setCheckBox={setCheckBox} users={users}></TableBody>
            </table>


        </>
    )
}

export default Table
