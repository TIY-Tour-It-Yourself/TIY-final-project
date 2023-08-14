import React, { useState, useEffect } from 'react';
import { TextField, Button, FormControl, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { gapi } from 'gapi-script';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import useMediaQuery from '@mui/material/useMediaQuery';
import Logo from '../Additionals/Logo/Logo';
import Header from '../Additionals/Header/Header';
import styles from './Login.module.css';
import PageContainer from '../Additionals/Container/PageContainer';
import Divider from '../Additionals/Divider/Divider';
import { Link, useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import jwt from 'jsonwebtoken';

const clientId =
   '302369383157-cc2iquq6s2e2ihq879qlfes2kbrc2f2e.apps.googleusercontent.com';

const Login = () => {
   const [rememberMe, setRememberMe] = useState(false);
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [isValid, setIsValid] = useState(false);
   const [isDirty, setIsDirty] = useState(false);
   const [isFormValid, setIsFormValid] = useState(false);
   const [is_accessible, setIsAccessible] = useState('');
   const navigate = useNavigate();
   const theme = useTheme();
   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         if (email.trim().length !== 0 && password.trim().length !== 0) {
            const response = await axios.post(
               `https://tiys.herokuapp.com/api/auth`,
               {
                  email,
                  password,
               }
            );
            const token = response.data.token;
            setIsFormValid(true);

            // RememberMe Logic
            if (rememberMe) {
               localStorage.setItem('token', token);
            } else {
               localStorage.removeItem('token', token);
            }

            if (response.status === 200) {
               if (isTokenValid(token)) {
                  handleNavigate(token);
               } else {
                  // Handle invalid token
                  alert('Invalid token. Please log in again.');
               }
            } else {
               console.log('Status is not 200');
            }
         } else {
            alert('All fields are required.');
            setIsFormValid(false);
         }
      } catch (err) {
         console.log(err.response.data.errors[0]);
         if (err.response.data.errors[0].msg == 'Password is not correct') {
            alert('Password is not correct.');
         } else if (err.response.data.errors[0].msg == 'Email is not correct') {
            alert('Email is not correct.');
         } else {
            alert('Invalid Credentials.');
         }
      }
   };

   useEffect(() => {
      const token = localStorage.getItem('token');
      if (token && isTokenValid(token)) {
         handleNavigate(token);
      }
   }, []);

   const handleNavigate = (token) => {
      if (email === 'admin@tiy.com') {
         navigate('/admin', { state: { token } });
      } else if (email === 'researcher@tiy.com') {
         navigate('/res_dashboard', { state: { token } });
      } else navigate('/dashboard', { state: { token } });
   };

   const isTokenValid = (token) => {
      try {
         const decodedToken = jwt.decode(token);

         // Check if the token is expired
         const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

         if (decodedToken.exp < currentTime) {
            return false; // Token has expired
         }
         return true; // Token is valid
      } catch (error) {
         return false; // Token is invalid or has an error
      }
   };

   const handleRememberMeChange = (event) => {
      setRememberMe(event.target.checked);
   };

   //Google OAuth User Connection - On success connection
   const onSuccess = async (res) => {
      const details = jwt_decode(res.credential);
      console.log(details);
      const response = await axios.post(
         `https://tiys.herokuapp.com/api/users/gmailauth`,
         {
            email: details.email,
            name: details.name,
            picture: details.picture,
         }
      );
      try {
         // console.log(response.data);
         const token = response.data.token;
         setIsFormValid(true);

         if (response.status == 200) {
            handleNavigate(token);
         } else {
            console.log('Status is not 200');
         }
      } catch (error) {
         console.log(`User could not log in:`, error);
      }
   };

   //Google OAuth User Connection - On failure connection
   const onFailure = (res) => {
      console.log('login failed: ', res);
   };

   //Login through Google - Takes data from Google
   useEffect(() => {
      const start = () => {
         gapi.client.init({
            client_id: clientId,
            scope: '',
         });
      };
      gapi.load('client:auth2', start);
   });

   return (
      <>
         <PageContainer>
            <Logo />
            <Header title='Welcome Back!' />
            <form onSubmit={handleSubmit}>
               <FormControl
                  sx={isSmallScreen ? { width: '100%' } : { width: '45%' }}
               >
                  <TextField
                     className={styles.input}
                     label='Email'
                     type='email'
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     margin='dense'
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
                     margin='dense'
                     error={!isValid && isDirty}
                     onBlur={() => setIsDirty(true)}
                     variant='outlined'
                     required
                  />
                  <div className={styles.checkbox}>
                     <label>
                        <input
                           type='checkbox'
                           checked={rememberMe}
                           onChange={handleRememberMeChange}
                        />
                        Remember Me
                     </label>
                  </div>
                  <Button
                     onClick={handleSubmit}
                     type='submit'
                     variant='contained'
                     color='primary'
                     sx={
                        isSmallScreen
                           ? { mt: 2, ml: 3.25, mb: 3, width: '80%' }
                           : { mt: 3, ml: 13.25, mb: 3, width: '50%' }
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
            <Typography
               sx={{
                  fontSize: 'small',
                  ...(isSmallScreen ? { mb: 1 } : { mt: 2, mb: 4 }),
               }}
            >
               <b>Don't Have An Account? </b>
               <Link
                  to='/register'
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
            <Divider title='Sign In With' />
            <div className={styles.flexbox}>
               <div id='signInButton'>
                  <GoogleLogin
                     client_id={clientId}
                     shape='circle'
                     button_text='Login'
                     onSuccess={onSuccess}
                     onFailure={onFailure}
                     cookie_policy={'single_host_origin'}
                  />
               </div>
            </div>
         </PageContainer>
      </>
   );
};

export default Login;
