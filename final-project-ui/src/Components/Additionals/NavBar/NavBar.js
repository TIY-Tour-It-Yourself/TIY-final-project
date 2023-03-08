import React, { useState } from 'react';
import styles from './NavBar.module.css';
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
import { grey } from '@mui/material/colors';
import useMediaQuery from '@mui/material/useMediaQuery';

const pages = ['Settings', 'Wallet', 'Events'];

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
      // {isSmallScreen && (
      <AppBar position='fixed' color='transparent' className={styles.bar}>
         <Container maxWidth='xl'>
            <Toolbar disableGutters>
          
               {/* Only present the following when screen is Desktop size */}
               {!isSmallScreen && (
                  <Box sx={{ flexGrow: 1, display: { md: 'flex' } }}>
                     <div className={styles.logo} />
                  </Box>
               )}

               <Box sx={{ flexGrow: 13, display: { xs: 'none', md: 'flex' },  mr: 15 }}>
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
            {!isSmallScreen && (
            <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="user" src={user} />
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
            //   onClose={handleCloseUserMenu}
            >
              {/* {settings.map((setting) => (
                <MenuItem key={setting} onClick={}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))} */}
            </Menu>
          </Box>)}

            </Toolbar>
         </Container>
      </AppBar>
      // )}
   );
};

export default NavBar;
