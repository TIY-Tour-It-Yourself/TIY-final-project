import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from './NavBarExternal.module.css';
import home from './nav_imgs/home_origin.png';
import home_clicked from './nav_imgs/home_clicked.png';
import user_settings from './nav_imgs/user_origin_new.png';
import user_settings_clicked from './nav_imgs/user_origin_new_clicked.png';
import history from './nav_imgs/history_origin.png';
import history_clicked from './nav_imgs/history_clicked.png';
import calendar from './nav_imgs/schedule_origin.png';
import calendar_clicked from './nav_imgs/schedule_clicked.png';
import customize_theme from './nav_imgs/customize_theme.png';
import customize_theme_clicked from './nav_imgs/customize_theme_clicked.png';
import logout_rounded from './nav_imgs/logout_rounded_corners.png';
import logout_rect from './nav_imgs/logout_rectangle.png';
import logout_straight from './nav_imgs/logout_straight.png';
import logo from '../Assets/logo_nav_no_sub.png';
import AppBar from '@mui/material/AppBar';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Avatar from '@mui/material/Avatar';
import difAvatar from './nav_imgs/user.png';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import LoadingBar from '../LoadingBar/LoadingBar';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const NavBarExternal = ({ activeImage, activeLink, userRole }) => {
   const [isLoading, setIsLoading] = useState(true);
   const [images, setImages] = useState([
      {
         id: 1,
         title: 'home',
         src: home,
         src_clicked: home_clicked,
         url: '/admin',
      },
      {
         id: 2,
         title: 'settings',
         src: user_settings,
         src_clicked: user_settings_clicked,
         url: '/user_settings',
      },
   ]);

   const [avatar, setAvatar] = useState(null);
   const [anchorEl, setAnchorEl] = useState(null);
   const open = Boolean(anchorEl);

   const location = useLocation();
   const navigate = useNavigate();

   const theme = useTheme();
   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

   useEffect(() => {
      if (!location.state) {
         navigate('/');
      }
      const fetchAvatar = async () => {
         try {
            const response = await axios.get(
               `https://tiys.herokuapp.com/api/auth`,
               {
                  headers: {
                     'x-auth-token': location.state.token,
                     'Content-Type': 'application/json',
                  },
               }
            );
            // console.log(response.data);
            setAvatar(response.data.avatar);
         } catch (error) {
            console.error('Error fetching user: ', error);
         }
      };
      fetchAvatar();
   }, []);

   const links = [
      { id: 1, title: 'Settings', url: `/user_settings` },
      // { id: 2, title: 'My Tours', url: '/tours_history' },
      // { id: 3, title: 'Customize App', url: '/theme_customization' },
   ];

   const handleImageClick = (imageUrl) => {
      navigate(imageUrl, {
         state: { token: location.state.token },
      });
   };

   //User menu interaction
   const handleOpenUserMenu = (event) => {
      setAnchorEl(event.currentTarget);
   };
   const handleCloseUserMenu = () => {
      setAnchorEl(null);
   };

   const openSettingsPage = (event) => {
      navigate('/user_settings', { state: { token: location.state.token } });
   };
   const handleLogout = (event) => {
      localStorage.removeItem('token');
      navigate('/');
   };

   const handleButtonClick = (newLink) => {
      if (links.filter((link) => link.title === newLink.title)) {
         navigate(newLink.url, { state: { token: location.state.token } });
      }
   };

   const handleAvatarLoad = () => {
      setIsLoading(false); // Avatar loaded, set loading to false
   };

   return (
      <AppBar
         position='fixed'
         sx={
            isSmallScreen
               ? { top: 'auto', bottom: 0, backgroundColor: 'white' }
               : { backgroundColor: 'white' }
         }
      >
         <Container maxWidth='xl'>
            <Toolbar disableGutters>
               {/* Only present the following when screen is Desktop size */}
               {!isSmallScreen && (
                  <Box sx={{ flexGrow: 1 }}>
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
                             display: { md: 'flex' },
                             mr: 15,
                          }
                        : { display: 'none' }
                  }
               >
                  {links.map((link) => {
                     {
                        console.log(userRole);
                     }
                     if (
                        (userRole === 'researcher' || userRole === 'admin') &&
                        link.title === 'Settings'
                     ) {
                        // Update the src for the researcher user
                        return (
                           <Button
                              disableRipple
                              key={link.id}
                              onClick={() =>
                                 handleButtonClick(
                                    navigate('/external_user_settings', {
                                       state: { token: location.state.token },
                                    })
                                 )
                              }
                              sx={{
                                 my: 2,
                                 mx: 1,
                                 // color: linksColor,
                                 color: '#00337C',
                                 display: 'block',
                                 borderRadius: '25px',
                                 ':hover': {
                                    bgcolor: 'none',
                                    textDecoration: 'underline',
                                    textUnderlinePosition: 'under',
                                 },
                                 '&:hover': {
                                    backgroundColor: 'transparent',
                                 },
                                 fontSize: '1.01rem',
                                 fontWeight: 'bold',
                                 fontFamily: 'Rubik, sans-serif',
                                 ...(activeLink === link.id
                                    ? {
                                         textDecoration: 'underline',
                                         textUnderlinePosition: 'under',
                                      }
                                    : {}),
                              }}
                           >
                              {link.title}
                           </Button>
                        );
                     } else {
                        return (
                           <Button
                              disableRipple
                              key={link.id}
                              onClick={() => handleButtonClick(link)}
                              sx={{
                                 my: 2,
                                 mx: 1,
                                 // color: linksColor,
                                 color: '#00337C',
                                 display: 'block',
                                 borderRadius: '25px',
                                 ':hover': {
                                    bgcolor: 'none',
                                    textDecoration: 'underline',
                                    textUnderlinePosition: 'under',
                                 },
                                 '&:hover': {
                                    backgroundColor: 'transparent',
                                 },
                                 fontSize: '1.01rem',
                                 fontWeight: 'bold',
                                 fontFamily: 'Rubik, sans-serif',
                                 ...(activeLink === link.id
                                    ? {
                                         textDecoration: 'underline',
                                         textUnderlinePosition: 'under',
                                      }
                                    : {}),
                              }}
                           >
                              {link.title}
                           </Button>
                        );
                     }
                  })}
               </Box>
               {isSmallScreen && (
                  <Box component='div'>
                     {images.map((img) => {
                        if (userRole === 'researcher' && img.title === 'home') {
                           // Update the src for the researcher user
                           return (
                              <Button
                                 component='div'
                                 sx={{ marginLeft: '17px' }}
                                 key={img.id}
                              >
                                 <img
                                    onClick={() =>
                                       handleImageClick('/res_dashboard')
                                    }
                                    src={img.src_clicked} // Use the clicked image source for the researcher user
                                    title={img.title}
                                    height='33'
                                    width='33'
                                 />
                              </Button>
                           );
                        } else if (
                           userRole === 'admin' &&
                           img.title === 'home'
                        ) {
                           return (
                              <Button
                                 component='div'
                                 sx={{ marginLeft: '17px' }}
                                 key={img.id}
                              >
                                 <img
                                    onClick={() => handleImageClick('/admin')}
                                    src={img.src_clicked} // Use the clicked image source for the researcher user
                                    title={img.title}
                                    height='33'
                                    width='33'
                                 />
                              </Button>
                           );
                        } else {
                           // Render the image link as usual- for TIY user
                           return (
                              <Button
                                 component='div'
                                 sx={{ marginLeft: '17px' }}
                                 key={img.id}
                              >
                                 <img
                                    onClick={() => handleImageClick(img.url)}
                                    src={
                                       activeImage === img.id
                                          ? img.src_clicked
                                          : img.src
                                    }
                                    title={img.title}
                                    height='33'
                                    width='33'
                                 />
                              </Button>
                           );
                        }
                     })}
                  </Box>
               )}

               <Box sx={{ flexGrow: 0 }}>
                  {!isSmallScreen && (
                     <Tooltip title='Open Menu'>
                        <IconButton onClick={handleOpenUserMenu}>
                           <Avatar alt='user' src={avatar} />
                        </IconButton>
                     </Tooltip>
                  )}
                  <Menu
                     sx={{ mt: '45px' }}
                     id='menu-appbar'
                     anchorEl={anchorEl}
                     anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                     }}
                     keepMounted
                     transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                     }}
                     open={open}
                     onClick={handleCloseUserMenu}
                     onClose={handleCloseUserMenu}
                  >
                     <MenuItem onClick={openSettingsPage}>
                        <ListItemIcon>
                           <Settings fontSize='small' />
                        </ListItemIcon>
                        Settings
                     </MenuItem>
                     <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                           <Logout fontSize='small' />
                        </ListItemIcon>
                        Logout
                     </MenuItem>
                  </Menu>
               </Box>
            </Toolbar>
         </Container>
      </AppBar>
   );
};

export default NavBarExternal;
