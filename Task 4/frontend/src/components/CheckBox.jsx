import React, { useState } from 'react'

const CheckBox = ({ setCheckBox, user_id, checked }) => {

    const onChange = (user_id) => {
        setCheckBox(user_id)
    }

    return (
        <>
            <td className="text-center">
                <input onChange={() => onChange(user_id)} checked={checked} type="checkbox"></input>
            </td>

        </>
    )
}

export default CheckBox
