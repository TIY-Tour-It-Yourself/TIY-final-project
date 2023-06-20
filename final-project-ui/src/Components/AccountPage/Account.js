import React, { useEffect, useState } from 'react';
import styles from './Account.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import NavBar from '../Additionals/NavBar/NavBar';
import PageContainer from '../Additionals/Container/PageContainer';
import { TextField, Button, FormControl, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';

const Account = ({ userRole }) => {
   const [activeImage, setActiveImage] = useState(null);
   const [activeLink, setActiveLink] = useState(null);
   const [isUpdated, setIsUpdated] = useState(false);
   const [fname, setFname] = useState('');
   const [password, setPassword] = useState('');
   const [email, setEmail] = useState('');
   const navigate = useNavigate();
   const location = useLocation();

   const theme = useTheme();
   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

   useEffect(() => {
      if (!location.state) {
         navigate('/');
      } else {
         setActiveImage(2);
         setActiveLink(1);
         axios
            .get(`https://tiys.herokuapp.com/api/auth`, {
               headers: {
                  'x-auth-token': location.state.token,
                  'Content-Type': 'application/json',
               },
            })
            .then((response) => {
               setFname(response.data.fname);
               setEmail(response.data.email);
            })
            .catch((error) => {
               console.error('Error fetching user: ', error);
            });
      }
   }, [location.state]);

   const handleUpdate = (e) => {
      e.preventDefault();
      //PUT request to update the data in DB
      if (fname && password) {
         axios
            .put('https://tiys.herokuapp.com/api/users', {
               fname,
               password,
               email,
            })
            .then((response) => {
               setIsUpdated(true);
            })
            .catch((error) => {
               console.log(error);
            });
      }
   };

   return (
      <>
         <NavBar
            activeImage={activeImage}
            activeLink={activeLink}
            userRole={userRole}
         />
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
                          mb: '3%',
                          textAlign: 'center',
                       }
                     : { textAlign: 'center', mt: '1%', mb: '9%' }
               }
            >
               <h1>Update Account</h1>
            </Typography>
            <form onSubmit={handleUpdate}>
               <FormControl
                  sx={isSmallScreen ? { width: '100%' } : { width: '45%' }}
               >
                  <TextField
                     className={styles.input}
                     label='Username'
                     type='text'
                     value={fname}
                     onChange={(e) => setFname(e.target.value)}
                     margin='dense'
                     variant='outlined'
                     required
                  />
                  <TextField
                     className={styles.input}
                     label='Password'
                     type='password'
                     // value=''
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
                           ? { mt: 2, ml: 6, mb: 3, width: '60%' }
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
                     <Typography component='div' color='primary'>
                        <h4>Changed Updated Successfully.</h4>
                     </Typography>
                  )}
               </FormControl>
            </form>
         </PageContainer>
      </>
   );
};

export default Account;
