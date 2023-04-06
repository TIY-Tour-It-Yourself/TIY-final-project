import React, { useEffect, useState } from 'react';
import styles from './Account.module.css';
import NavBar from '../Additionals/NavBar/NavBar';
import PageContainer from '../Additionals/Container/PageContainer';
import { TextField, Button, FormControl, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';

const Account = () => {
   const [isUpdated, setIsUpdated] = useState(false);
   const [username, setUsername] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');


   const theme = useTheme();
   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

   useEffect(() => {
      //Get users' data from DB
      axios
         .get('https://tiys.herokuapp.com/api/auth')
         .then((response) => {
            const { username, email, password } = response.data;
            setUsername(username);
            setEmail(email);
            setPassword(password);
         })
         .catch((error) => {
            console.log(error);
         });
   }, []);

   //    const handleUpdate = async (e) => {
   const handleUpdate = (e) => {
      e.preventDefault();
      //POST request to update the data in DB
      axios
         .post('https://tiys.herokuapp.com/api/auth', {
            username,
            email,
            password,
         })
         .then((response) => {
            console.log(response);
            setIsUpdated(true); //update changes in DB
         })
         .catch((error) => {
            console.log(error);
         });
   };

   return (
      <>
         <NavBar />
         <PageContainer>
         <Typography
            component='div'
            className={styles.title}
            sx={
               !isSmallScreen
                  ? {
                       display: 'flex',
                       flexDirection: 'row',
                       justifyContent: 'center',
                       mt: '5%',
                       textAlign: 'center',
                    }
                  : { textAlign: 'center', mt: '10%' }
            }
         >
            <h1>Settings</h1>
         </Typography>
         <form onSubmit={handleUpdate}>
            <FormControl
               sx={isSmallScreen ? { width: '100%' } : { width: '45%' }}
            >
               <TextField
                  className={styles.input}
                  label='Username'
                  type='text'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  margin='dense'
                  variant='outlined'
                  required
               />
               <TextField
                  className={styles.input}
                  label='Email'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  margin='dense'
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
                  variant='outlined'
                  required
               />
               <Button
                  onClick={handleUpdate}
                  className={styles.button}
                  type='submit'
                  variant='contained'
                  color='primary'
                  sx={
                     isSmallScreen
                        ? { mt: 2, ml: 2, mb: 3, width: '80%' }
                        : { mt: 3, ml: 12, mb: 3, width: '50%' }
                  }
                  style={{
                     borderRadius: 20,
                     backgroundColor: '#2471A3',
                  }}
               >
                  Update Info
               </Button>
               {isUpdated && (
                  <Typography color='primary'>
                     Changed Updated Successfully.
                  </Typography>
               )}
            </FormControl>
         </form>
         </PageContainer>
      </>
   );
};

export default Account;
