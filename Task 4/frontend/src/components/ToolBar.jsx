import React from 'react'

const ToolBar = ({ banUsers, unBanUsers, deleteUsers }) => {

    return (
        <>
            <div className="row mb-3">
                <div className="col">
                    <button onClick={() => banUsers()} className="btn btn-primary me-2 btn-warning" id="blockBtn">Block</button>
                    <button onClick={() => unBanUsers()} className="btn btn-primary me-2 btn-success" id="unblockBtn">Unblock</button>
                    <button onClick={() => deleteUsers()} className="btn btn-danger" id="deleteBtn"><i className="bi bi-trash"></i> Delete</button>
                </div>
            </div>

        </>
    )
}

export default ToolBar
