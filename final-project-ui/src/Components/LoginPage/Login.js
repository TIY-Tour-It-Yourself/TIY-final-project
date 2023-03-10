import React, { useState, useEffect } from 'react';
import {
   TextField,
   Button,
   FormControl,
   Typography,
   Link,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { googleLogout, useGoogleLogin, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import useMediaQuery from '@mui/material/useMediaQuery';
import Logo from '../Additionals/Logo/Logo';
import Header from '../Additionals/Header/Header';
import styles from './Login.module.css';
import PageContainer from '../Additionals/Container/PageContainer';
import Divider from '../Additionals/Divider/Divider';
import { useNavigate } from 'react-router-dom';

const Login = (props) => {
   const [user, setUser] = useState([]);
   const [profile, setProfile] = useState(false);
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [isValid, setIsValid] = useState(false);
   const [isDirty, setIsDirty] = useState(false); 
   const navigate = useNavigate();

   const login = useGoogleLogin({
      onSuccess: (codeResponse) => setUser(codeResponse),
      onError: (error) => console.log('Login Failed:', error)
  });

   const handleSubmit = (e) => {
      e.preventDefault();
      console.log(`Email: ${email}, Password: ${password}`);
   };

   const theme = useTheme();
   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

   useEffect(
      () => {
          if (user) {
              axios
                  .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                      headers: {
                          Authorization: `Bearer ${user.access_token}`,
                          Accept: 'application/json'
                      }
                  })
                  .then((res) => {
                     setProfile(res.data);
                     navigate('/dashboard');
                  })
                  .catch((err) => console.log(err));
          }
      },
      [ user ]
  );

  // log out function to log the user out of google and set the profile array to null
  const logOut = () => {
      googleLogout();
      setProfile(null);
   };

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
                     error={!isValid && isDirty}
                     onBlur={() => setIsDirty(true)}
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
                     error={!isValid && isDirty}
                     onBlur={() => setIsDirty(true)}
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
            <div>
            {profile ? (
               {/* <button onClick={logOut}>Log out</button> */}
               //  <div>
               //      <img src={profile.picture} alt="user image" />
               //      <h3>User Logged in</h3>
               //      <p>Name: {profile.name}</p>
               //      <p>Email Address: {profile.email}</p>
               //      <br />
               //      <br />
               //      <button onClick={logOut}>Log out</button>
               //  </div> */}
               
            ) : (
                <div className={styles.google_icon} onClick={() => login()}></div>
            )}
        </div>
            </div>
         </PageContainer>
      </>
   );
};

export default Login;
