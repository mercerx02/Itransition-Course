import { createContext, useEffect, useMemo, useState } from "react"
import LoginPage from "./pages/LoginPage"
import MainPage from "./pages/MainPage"
import ReviewPage from "./pages/ReviewPage";
import ManipulateReview from "./components/ManipulateReview";
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import {ThemeProvider, createTheme } from '@mui/material/styles';
import AlertComponent from "./components/AlertComponent";
import CssBaseline from "@mui/material/CssBaseline";
import UserPage from "./pages/UserPage";
import AdminPage from "./pages/AdminPage";
import FilterPage from "./pages/FilterPage";
import SecureUser from "./components/SecureUser";
import SecureAdminPage from "./components/SecureAdminPage";
import NotFoundPage from "./pages/NotFoundPage";
import SecureEditReview from "./components/SecureEditReview";
import { getReviews } from "./services/reviewsService";
import { getMe } from "./services/usersService";
import Footer from "./components/Footer";

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});


function App({BACKEND_URL, CLIENT_URL}) {
  const [mode, setMode] = useState(()=>{
    const color_mode = localStorage.getItem('color_mode')
    if(color_mode){
      return color_mode
    }
    return 'light'
  })
  const [user, setUser] = useState(null)
  const [reviews, setReviews] = useState([])
  const itemsPerPage = 3;
  const [page, setPage] = useState(1);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const [alertMessage, setAlertMessage] = useState('')
  const [openAlert, setOpenAlert] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [adminMode, setAdminMode] = useState(() => {
    const savedAdminMode = localStorage.getItem('adminMode');
    const booleanValue = savedAdminMode === "true" ? true : false;
    return booleanValue
  });

  useEffect(() => {
    getMe()
    .then(result => setUser(result))

  }, []);

  useEffect(() => {
    getReviews()
    .then(result => setReviews(result))

}, []);


  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {

        setMode((prevMode) => {
          const new_mode = prevMode === "light" ? "dark" : "light"
          localStorage.setItem('color_mode', new_mode)
          return new_mode
        });
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

    <ResponsiveAppBar BACKEND_URL={BACKEND_URL} CLIENT_URL={CLIENT_URL} setAdminMode={setAdminMode} adminMode={adminMode} setSearchResults={setSearchResults} reviews={reviews} searchInput={searchInput} setSearchInput={setSearchInput} user={user}></ResponsiveAppBar>
    <AlertComponent open={openAlert} setOpen={setOpenAlert} message={alertMessage}></AlertComponent>
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/"></Navigate> : <LoginPage BACKEND_URL={BACKEND_URL} CLIENT_URL={CLIENT_URL} ></LoginPage>}></Route>
        <Route path="/" element={<MainPage searchResults={searchResults} setPage={setPage} endIndex={endIndex} startIndex={startIndex} page={page} itemsPerPage={itemsPerPage} user={user} reviews={reviews} setReviews={setReviews}></MainPage>}></Route>
        <Route path="/review/:id" element={<ReviewPage adminMode={adminMode} setOpenAlert={setOpenAlert} setAlertMessage={setAlertMessage} reviews={reviews} setReviews={setReviews} user={user}></ReviewPage>}></Route>
        <Route path="/user/:id/create" element={<SecureUser setOpenAlert={setOpenAlert} setAlertMessage={setAlertMessage}></SecureUser>}>
          <Route index element={<ManipulateReview adminMode={adminMode} setReviews={setReviews} setOpen={setOpenAlert} setAlertMessage={setAlertMessage} mode='create' user={user}></ManipulateReview>}></Route>
        </Route>
        <Route path="/review/:id/edit" element={<SecureEditReview setOpenAlert={setOpenAlert} setAlertMessage={setAlertMessage} ></SecureEditReview>}>
          <Route index element={<ManipulateReview setReviews={setReviews} reviews={reviews} adminMode={adminMode} setOpen={setOpenAlert} setAlertMessage={setAlertMessage} mode='edit' user={user}></ManipulateReview>}></Route>
        </Route>

        <Route path="/user/:id" element={<UserPage adminMode={adminMode} me={user} searchResults={searchResults} user={user} endIndex={endIndex} startIndex={startIndex} setReviews={setReviews}></UserPage>}></Route>

        <Route path="/admin" element={<SecureAdminPage adminMode={adminMode}></SecureAdminPage>}>
          <Route index element={<AdminPage></AdminPage>}></Route>
        </Route>
        <Route path="/reviews/tags/:tag" element={<FilterPage searchResults={searchResults} setPage={setPage} endIndex={endIndex} startIndex={startIndex} page={page} itemsPerPage={itemsPerPage} user={user}></FilterPage>}></Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
    <Footer></Footer>
    </ThemeProvider>
    </ColorModeContext.Provider>

    </>
  )
}

export default App
