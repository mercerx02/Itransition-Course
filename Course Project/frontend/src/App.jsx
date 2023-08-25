import { createContext, useEffect, useMemo, useState } from "react"
import Login from "./components/Login"
import MainPage from "./components/MainPage"
import Review from "./components/Review";
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

  const reviews = [
    {
      id: 1,
      user: 'John Doe',
      date: 'August 20, 2023',
      title: 'Amazing Product',
      tags: ['Tech', 'Gadgets'],
      rating: 9.5,
      likes: 150,
      comments: 32,
      image: 'product.jpg', // Add the image path here
    },
    {
      id: 1,
      user: 'John Doe',
      date: 'August 20, 2023',
      title: 'Amazing Product',
      tags: ['Tech', 'Gadgets'],
      rating: 9.5,
      likes: 150,
      comments: 32,
      image: 'product.jpg', // Add the image path here
    },
    {
      id: 1,
      user: 'John Doe',
      date: 'August 20, 2023',
      title: 'Amazing Product',
      tags: ['Tech', 'Gadgets'],
      rating: 9.5,
      likes: 150,
      comments: 32,
      image: 'product.jpg', // Add the image path here
    },
    {
      id: 1,
      user: 'John Doe',
      date: 'August 20, 2023',
      title: 'Amazing Product',
      tags: ['Tech', 'Gadgets'],
      rating: 9.5,
      likes: 150,
      comments: 32,
      image: 'product.jpg', // Add the image path here
    },
    // Add more review objects here
  ];

  const tags = [
    { value: 'JavaScript', count: 38 },
    { value: 'React', count: 30 },
    { value: 'Nodejs', count: 28 },
    { value: 'Express.js', count: 25 },
    { value: 'HTML5', count: 33 },
    { value: 'MongoDB', count: 18 },
    { value: 'CSS3', count: 20 },
    // Add more tags here...
  ];


  useEffect(()=>{
    const getMe = () =>{
      fetch('https://itranstition-course-project.onrender.com/auth/user/me',{
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
        <Route path="/" element={<MainPage tags={tags} reviews={reviews}></MainPage>}></Route>
        <Route path="/review/:id" element={<Review reviews={reviews}></Review>}></Route>
      </Routes>
    </Router>
    </ThemeProvider>
    </ColorModeContext.Provider>

    </>
  )
}

export default App
