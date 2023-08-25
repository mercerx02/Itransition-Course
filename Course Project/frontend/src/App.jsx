import { createContext, useEffect, useMemo, useState } from "react"
import Login from "./components/Login"
import MainPage from "./components/MainPage"
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import ResponsiveAppBar from "./components/ResponsiveAppBar";

import {ThemeProvider, createTheme } from '@mui/material/styles';

import CssBaseline from "@mui/material/CssBaseline";

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});



function App() {
  const [mode, setMode] = useState("light")
  const [user, setUser] = useState(null)

  useEffect(()=>{
    const getMe = () =>{
      fetch('http://localhost:5000/auth/user/me',{
        method: 'GET',
        credentials: 'include',
        headers:{
          Accept: 'application/json',
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        },

      })
      .then(response =>{
        if(response.status === 200) return response.json()
        throw new Error('Auth failed')
      })
      .then(data =>{
        setUser(data.user)
        console.log(data.user)
      })
      .catch(err =>{
        console.log(err)
      })
    }
    getMe()
  },[])


  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );



  return (
    <>
    <ColorModeContext.Provider value={colorMode}>
    <ThemeProvider theme={theme}>
    <CssBaseline />

    {/* <NavBar user={user}></NavBar> */}
    <ResponsiveAppBar user={user}></ResponsiveAppBar>
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/"></Navigate> : <Login></Login>}></Route>
        <Route path="/" element={<MainPage></MainPage>}></Route>
      </Routes>
    </Router>
    </ThemeProvider>
    </ColorModeContext.Provider>

    </>
  )
}

export default App
