import { useEffect, useState } from "react"
import { Outlet } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { getMe } from "../services/usersService";

const SecureAdminPage = ({adminMode}) => {
    const [user, setUser] = useState(null)
    useEffect(() => {
      getMe()
      .then(result => setUser(result))

    }, []);

    if(!user){
    }
    else if(user.is_admin && adminMode){
        return <Outlet></Outlet>
    }
    else{
        return <Navigate to='/'/>
    }

}

export default SecureAdminPage
