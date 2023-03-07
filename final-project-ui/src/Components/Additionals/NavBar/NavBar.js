import React, { useState } from 'react';
import styles from './NavBar.module.css';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import MoreIcon from '@mui/icons-material/MoreVert';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import Toolbar from '@mui/material/Toolbar';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import logo_nav from '../Assets/logo_nav.png'
import { display } from '@mui/system';
import { Visibility } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const NavBar = () => {
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
      };
 
   return (
      <div className={styles.bar}> 
      { !isSmallScreen &&
      (<Box sx={{ flexGrow: 1, display: { md: 'flex'} }}>
      <div className={styles.logo}></div>
      <IconButton onClick={ handleOpenUserMenu } sx={{ p: 0, ml: 173 }}>
          <Avatar alt="user" src='/src/Additionals/Assets/user.png'/>
      </IconButton>
      </Box>)}
      </div>
   );
};

export default NavBar;
