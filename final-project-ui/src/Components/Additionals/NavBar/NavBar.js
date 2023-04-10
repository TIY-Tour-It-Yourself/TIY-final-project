import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from './NavBar.module.css';
import home from './nav_imgs/home_origin.png';
import home_clicked from './nav_imgs/home_clicked.png';
import user_settings from './nav_imgs/user_origin_new.png';
import user_settings_clicked from './nav_imgs/user_origin_new_clicked.png';
import history from './nav_imgs/history_origin.png';
import history_clicked from './nav_imgs/history_clicked.png';
import calendar from './nav_imgs/schedule_origin.png';
import calendar_clicked from './nav_imgs/schedule_clicked.png';
import logo from '../Assets/logo_nav_no_sub.png';
import AppBar from '@mui/material/AppBar';
// import Typography from '@mui/material/Typography';
// import MoreIcon from '@mui/icons-material/MoreVert';
// import MenuIcon from '@mui/icons-material/Menu';
import Tooltip from '@mui/material/Tooltip';
// import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
// import AddIcon from '@mui/icons-material/Add';
import Toolbar from '@mui/material/Toolbar';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import user from './user.png';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const NavBar = ({ token, activeImage, activeLink }) => {
   const [images, setImages] = useState([
      { id: 1, title: 'home', src: home, src_clicked: home_clicked, url: '/dashboard' },
      { id: 2, title: 'settings', src: user_settings, src_clicked: user_settings_clicked, url: '/user_settings' },
      { id: 3, title: 'tours_history', src: history, src_clicked: history_clicked, url: '/tours_history' },
      { id: 4, title: 'monthly_events', src: calendar, src_clicked: calendar_clicked, url: '/events' },
   ]);
   
   const [updatedToken, setUpdatedToken] = useState('');
   const [anchorElNav, setAnchorElNav] = useState('');
   const [anchorElUser, setAnchorElUser] = useState('');

   const location = useLocation();
   const navigate = useNavigate();

   const theme = useTheme();
   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
   console.log(token);

   useEffect(() => {
      if (!location.state) {
         navigate('/');
      } else {
         axios
            .get(`https://tiys.herokuapp.com/api/auth`, {
               headers: {
                  'x-auth-token': location.state.token.token,
                  'Content-Type': 'application/json',
               },
            })
            .then((response) => {
               console.log(response.data);
            })
            .catch((error) => {
               console.error('Error fetching user: ', error);
            });
      }
   }, [location.state]);

   console.log(activeLink);
   
   const links = [
      { id: 1, title: 'Settings', url: `/user_settings` },
      { id: 2, title: 'My Tours', url: '/tours_history' },
      { id: 3, title: 'Monthly Events', url: '/events' },
   ];

   const handleImageClick = (imageUrl) => {
      navigate(imageUrl, { state: { token: token }});
    }

   const handleOpenUserMenu = (event) => {
      setAnchorElUser(event.currentTarget);
   };

   // const handleOpenNavMenu = (event) => {
   //    setAnchorElNav(event.currentTarget);
   // };

   const handleCloseNavMenu = () => {
      setAnchorElNav(null);
   };

   const handleButtonClick = () => {
      if (links.filter((link) => link.url === 'user_settings')) {
         navigate('/user_settings', { state: { token: token } });
      } else if (links.filter((link) => link.url === 'tours_history')) {
         navigate('/tours_history', { state: { token: token } });
      } else if (links.filter((link) => link.url === 'events')) {
         navigate('/events', { state: { token: token } });
      }
   };

   const handleTokenUpdate = (newToken) => {
      setUpdatedToken(newToken);
   };

   return (
      <AppBar
         position='fixed'
         style={{ backgroundColor: 'white' }}
         sx={isSmallScreen ? { top: 'auto', bottom: 0 } : {}}
      >
         <Container maxWidth='xl'>
            <Toolbar disableGutters>
               {/* Only present the following when screen is Desktop size */}
               {!isSmallScreen && (
                  <Box sx={{ flexGrow: 1, display: { md: 'flex' } }}>
                     <div>
                        <img
                           src={logo}
                           alt='Logo'
                           className={styles.logo}
                           onClick={() =>
                              navigate('/dashboard', {
                                 state: { token: location.state.token },
                              })
                           }
                        />
                     </div>
                  </Box>
               )}
               <Box
                  sx={
                     !isSmallScreen
                        ? {
                             flexGrow: 13,
                             display: { xs: 'flex', md: 'flex' },
                             mr: 15,
                          }
                        : { display: 'none' }
                  }
               >
                  {links.map((link) => (
                     <Button disableRipple
                        key={link.id}
                        onClick={handleButtonClick}
                        sx={{
                           my: 2,
                           mx: 1,
                           color: '#00337C',
                           display: 'block',
                           borderRadius: '25px',
                           ':hover': {
                              bgcolor: 'none',
                              textDecoration: 'underline',
                              textUnderlinePosition: 'under'
                            },
                            '&:hover': {
                              backgroundColor: 'transparent',
                            },
                           fontSize: '1.01rem',
                           fontWeight: 'bold',
                           fontFamily: 'Rubik, sans-serif',
                           ...(activeLink === link.id ? { textDecoration: 'underline', textUnderlinePosition: 'under' } : {}),
                        }}
                     >
                        {link.title}
                     </Button>
                  ))}
               </Box>
               {isSmallScreen && (
                  <Box className={styles.images}>
                     {images.map((img) => (
                        <div
                           className={styles.imgs}
                           key={img.id}
                           >
                           <a href={img.url}> 
                              <img 
                                 onClick={() => handleImageClick(img.url)}
                                 src={activeImage === img.id ? img.src_clicked : img.src}
                                 title={img.title}
                                 height='33'
                                 width='33'
                              />
                           </a>
                        </div>
                     ))}
                  </Box>
               )}

               <Box sx={{ flexGrow: 0 }}>
                  {!isSmallScreen && (
                     <Tooltip title='Open settings'>
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                           <Avatar alt='user' src={user} />
                        </IconButton>
                     </Tooltip>
                  )}
                  <Menu
                     sx={{ mt: '45px' }}
                     id='menu-appbar'
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
                     //   onClose={handleCloseUserMenu}
                  >
                     {/* {settings.map((setting) => (
                <MenuItem key={setting} onClick={}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))} */}
                  </Menu>
               </Box>
            </Toolbar>
         </Container>
      </AppBar>
      // )}
   );
};

export default NavBar;
