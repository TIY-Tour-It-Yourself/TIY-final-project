import React, { useState } from 'react';
import styles from './NavBar.module.css';
import home from './nav_imgs/home.png';
import user_settings from './nav_imgs/user-48.png';
import wallet from './nav_imgs/wallet-48.png';
import calendar from './nav_imgs/calendar-32.png';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import MoreIcon from '@mui/icons-material/MoreVert';
import MenuIcon from '@mui/icons-material/Menu';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AddIcon from '@mui/icons-material/Add';
import Toolbar from '@mui/material/Toolbar';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import user from './user.png';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const pages = ['Settings', 'Wallet', 'Events'];
const images = [{id: 1, title: "home", src:`${home}`, url: '#'},{id: 2, title: "settings", src:`${user_settings}`, url: '#'},{id: 3, title: "wallet", src:`${wallet}`, url: '#'},{id: 4, title: "events", src:`${calendar}`, url: '#'}];

const NavBar = () => {
   const [anchorElNav, setAnchorElNav] = useState('');
   const [anchorElUser, setAnchorElUser] = useState('');

   const theme = useTheme();
   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

   const handleOpenUserMenu = (event) => {
      setAnchorElUser(event.currentTarget);
   };

   const handleOpenNavMenu = (event) => {
      setAnchorElNav(event.currentTarget);
   };
   const handleCloseNavMenu = () => {
      setAnchorElNav(null);
   };

   return (
      <AppBar position='fixed' color='transparent' sx={isSmallScreen ? {top: 'auto', bottom: 0} : {}}>
         <Container maxWidth='xl'>
            <Toolbar disableGutters>
          
               {/* Only present the following when screen is Desktop size */}
               {!isSmallScreen && (
                  <Box sx={{ flexGrow: 1, display: { md: 'flex' } }}>
                     <div className={styles.logo} />
                  </Box>
               )}
               <Box sx={!isSmallScreen ? { flexGrow: 13, display: { xs: 'flex', md: 'flex' },  mr: 15 } : {display: 'none'}}>
                  {pages.map((page) => (
                     <Button
                        key={page}
                        onClick={handleCloseNavMenu}
                        sx={{
                           my: 2,
                           color: '#00337C',
                           display: 'block',
                           fontSize: '1rem',
                           fontWeight: 'bold',
                        }}
                     >
                        {page}
                     </Button>
                  ))}
               </Box>

               {isSmallScreen && 
               (<Box className={styles.images}>
                 { images.map((img) =>
                  <div key={img.id}><a href={img.url}><img src={img.src} title={img.title} height='33' width='33'/></a></div>
                  )}
               </Box>)}       
               
            <Box sx={{ flexGrow: 0 }}>
            {!isSmallScreen && (
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="user" src={user} />
              </IconButton>
            </Tooltip>
             )}
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