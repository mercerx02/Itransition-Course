import React, { useState } from 'react'

const TableHeadings = ({ setStatusAllUsers }) => {
    const [flag, setFlag] = useState(false)
    const changeStatus = () => {
        setFlag(!flag)
        setStatusAllUsers(!flag)

    }
    return (
        <>
            <thead>
                <tr>
                    <th scope="col" className="text-center">
                        <input onChange={() => changeStatus()} checked={flag} type="checkbox" id="selectAll"></input>
                    </th>
                    <th scope="col">Идентификатор</th>
                    <th scope="col">Имя</th>
                    <th scope="col">Email</th>
                    <th scope="col">Дата регистрации</th>
                    <th scope="col">Дата последнего логина</th>
                    <th scope="col">Статус</th>
                </tr>
            </thead>


        </>
    )
}

export default TableHeadings
