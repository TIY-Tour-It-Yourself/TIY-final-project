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
import styles from './Register.module.css';
import PageContainer from '../Additionals/Container/PageContainer';
import Divider from '../Additionals/Divider/Divider';

const Register = (props) => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [isValid, setIsValid] = useState(false);
   const [isDirty, setIsDirty] = useState(false); 

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
            <Header title='Welcome!' secondaryTitle='Create A New Account'/>
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
                     Sign Up
                  </Button>
               </FormControl>
            </form>
            <Typography style={{ fontSize: 'small' }} sx={{ mt: 2, mb: 1 }}>
               <b>Already Have An Account?</b>{' '}
               <Link
                  href='/'
                  sx={{
                     textDecoration: 'none',
                     '&:hover': {
                        textDecoration: 'underline',
                     },
                  }}
               >
                  Sign In
               </Link>
            </Typography>
            <Divider title='Sign Up With' />
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

export default Register;
