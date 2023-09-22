import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useContext, useEffect, useState } from 'react';
import { ColorModeContext } from '../App';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import MiniSearch from 'minisearch'
import ReviewsIcon from '@mui/icons-material/Reviews';
import Switch from '@mui/material/Switch';
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import Select from '@mui/material/Select';
import { useTranslation } from "react-i18next";


const ResponsiveAppBar = ({ user, searchInput, setSearchInput , reviews, setSearchResults, adminMode, setAdminMode, BACKEND_URL, CLIENT_URL}) => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [searchIndex, setSearchIndex] = useState(null)
  const colorMode = useContext(ColorModeContext);
  const theme = useTheme();
  const [lang, setLang] = useState(()=>{
    const lang = localStorage.getItem('lang');
    if(lang){
    return lang
    }
    return 'eng'
  })
  const { i18n } = useTranslation();
  const { t } = useTranslation()

  useEffect(()=>{
    let index = new MiniSearch({
      idField:'_id',
      fields: ['name', 'review_object', 'group', 'text','tags.name'],
      searchOptions:{
        boost:{'name':2, 'review_object':1},
        prefix: true,
        fuzzy:0.25
      },
      storeFields:['name','review_object','group','text','tags','createdAt','likes','comments','piece','photo_url','author_note','author_id','_id']
    })
    index.addAll(reviews)
    setSearchIndex(index)

  },[])


  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = (setting) => {
    setAnchorElUser(null);
    if(setting === 'Log Out'){
      window.open(`${BACKEND_URL}/auth/logout`, '_self');

    }
    else if (setting === 'Profile'){
      window.open(`${CLIENT_URL}/user/${user._id}`, '_self')
    }
    else if (setting === 'admin'){
      window.open(`${CLIENT_URL}/admin`, '_self')

    }
  };
  const handleAdminChange = (e) => {
    setAdminMode(!adminMode)
    localStorage.setItem('adminMode', !adminMode);


  }

  const handleLangChange = (event) => {
    setLang(event.target.value);
    i18n.changeLanguage(event.target.value);
    localStorage.setItem('lang', event.target.value);



  };

  const handleSearchInput = (e) =>{
    setSearchInput(e.target.value)
    searchIndex.removeAll()
    searchIndex.addAll(reviews)
    const results = searchIndex.search(e.target.value, {})
    setSearchResults(results)

  }

  return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <ReviewsIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Recomendations
          </Typography>
          <Box sx={{ flexGrow: 1 }}>
          <TextField
            label={t('search')}
            variant="outlined"
            size="small"
            sx={{ width: '250px' , display: {xs:'none', md:'flex'}}}
            value={searchInput}
            onChange={handleSearchInput}
            fullWidth
            InputProps={{
              startAdornment: (
                <SearchIcon color="inherit" />
              ),
            }}
          />
        </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1 }} />
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>

            {user ? (
              <>
                <Typography sx={{ ml: 1 , p: 2}}>{user.name}</Typography>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={user.name} src={user.photo_url} />

                  </IconButton>
                </Tooltip>

                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                <MenuItem key={t('profile')} onClick={() => handleCloseUserMenu("Profile")}>
                  <Typography textAlign="center">{t('profile')}</Typography>
                </MenuItem>
                <MenuItem key='lang'>
                  <LanguageOutlinedIcon />
                  <Select
                    value={lang}
                    onChange={handleLangChange}
                    sx={{ height: '30px' }}

                  >
                    <MenuItem value="eng">eng</MenuItem>
                    <MenuItem value="ru">ru</MenuItem>
                  </Select>
                </MenuItem>
                  {user.is_admin &&
                    <MenuItem key='admin'>
                      <SupervisorAccountOutlinedIcon></SupervisorAccountOutlinedIcon>
                      <Typography>{t('admin')}</Typography>
                      <Switch checked={adminMode} onChange={handleAdminChange}></Switch>
                    </MenuItem>
                  }
                  {adminMode && user.is_admin  &&
                    <MenuItem onClick={() => handleCloseUserMenu('admin')} key='adminPage'>
                      <Typography>{t('admin page')}</Typography>
                    </MenuItem>
                  }
                <MenuItem key={t('log out')} onClick={() => handleCloseUserMenu("Log Out")}>
                  <Typography textAlign="center">{t('log out')}</Typography>
                </MenuItem>

                </Menu>
              </>
            ) : (
              <IconButton href='/login' sx={{ paddingLeft: 2 }}>
                Log in
              </IconButton>
            )}
            <IconButton sx={{ ml: 1, paddingRight:2 }} onClick={colorMode.toggleColorMode} color="inherit">
              {theme.palette.mode === 'dark' ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default ResponsiveAppBar;
