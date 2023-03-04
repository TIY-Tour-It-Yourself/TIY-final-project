import React, { useState } from 'react';
import {
   TextField,
   Button,
   FormControl,
   Typography,
   Link,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Logo from '../Additionals/Logo/Logo';
import Header from '../Additionals/Header/Header';
import styles from './Login.module.css';
import PageContainer from '../Additionals/Container/PageContainer';
import Divider from '../Additionals/Divider/Divider';

const Login = (props) => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');

   const handleSubmit = (e) => {
      e.preventDefault();
      console.log(`Email: ${email}, Password: ${password}`);
   };

   const theme = useTheme();
   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

   return (
      <>
         <PageContainer>
            <Logo />
            <Header title='Welcome Back!' />
            <form onSubmit={handleSubmit}>
               <FormControl
                  sx={isSmallScreen ? { width: '50%' } : { width: '40%' }}
               >
                  <TextField
                     className={styles.input}
                     label='Email'
                     type='email'
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     margin='normal'
                     variant='outlined'
                     required
                  />
                  <TextField
                     className={styles.input}
                     label='Password'
                     type='password'
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     margin='normal'
                     variant='outlined'
                     required
                  />
                  <Button
                     className={styles.button}
                     type='submit'
                     variant='contained'
                     color='primary'
                     sx={
                        isSmallScreen
                           ? { mt: 4, ml: 2, width: '80%' }
                           : { mt: 3, ml: 14, width: '50%' }
                     }
                     style={{
                        borderRadius: 20,
                        backgroundColor: '#2471A3',
                     }}
                  >
                     Login
                  </Button>
               </FormControl>
            </form>
            <Typography sx={{ mt: 0, mb: 1 }}>
               <Link style={{ fontSize: '0.75rem', color: 'black'}}
                  // Need to define navigation to retreive password
                  href='/'
                  sx={{
                     textDecoration: 'none',
                     '&:hover': {
                        textDecoration: 'underline',
                     }, 
                  }}
               >
                  <b>Forgot Password?</b>
               </Link> 
               </Typography>
            <Typography style={{ fontSize: 'small' }} sx={isSmallScreen ? { mb:1 } : { mt: 2, mb: 4 }}>
               <b>Don't Have An Account?</b>{' '}
               <Link
                  href='/register'
                  sx={{
                     textDecoration: 'none',
                     '&:hover': {
                        textDecoration: 'underline',
                     },
                  }}
               >
                  Sign Up
               </Link>
            </Typography>
            <Divider title='Sign In With'/>
            <div className={styles.flexbox}>
               <a href='#'>
                  <div className={styles.facebook_icon}></div>
               </a>
               <a href='#'>
                  <div className={styles.google_icon}></div>
               </a>
            </div>
         </PageContainer>
      </>
   );
};

export default Login;
