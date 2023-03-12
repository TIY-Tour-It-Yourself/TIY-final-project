import React, { useState, useEffect } from 'react';
import {
   TextField,
   Button,
   FormControl,
   Typography,
   Link,
   Box,
   InputLabel,
   MenuItem,
   Select
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import useMediaQuery from '@mui/material/useMediaQuery';
import Logo from '../Additionals/Logo/Logo';
import Header from '../Additionals/Header/Header';
import styles from './Register.module.css';
import PageContainer from '../Additionals/Container/PageContainer';
import Divider from '../Additionals/Divider/Divider';
import { fontSize } from '@mui/system';
import { useNavigate } from 'react-router-dom';

const Register = (props) => {
   const [fullname, setFullname] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [age, setAge] = useState('');
   const [isAccessible, setIsAccessible] = useState('');
   const [isValid, setIsValid] = useState(false);
   const [isDirty, setIsDirty] = useState(false);
   const [isFormValid, setIsFormValid] = useState(false);

   const navigate = useNavigate();

   const handleSubmit = (e) => {
      e.preventDefault();

      //Post request
      // try {
      //    const res = axios.post(url, {fullname: fullname, email: email, 
      //       password: password, age: age, isAccessible: isAccessible});
      //       console.log(res.data);
      // } catch (error) {
      //    console.log(error.response);
      // }
      console.log(fullname, email, password, age, isAccessible);

      //If all fields not filled
      if(fullname.trim().length !== 0 && email.trim().length !== 0 && password.trim().length !== 0 && age.trim().length !== 0 && isAccessible){
         console.log(fullname);
         setIsFormValid(true);
         navigate('/dashboard');
      }
      else
         alert("All fields are required.");
         setIsFormValid(false);
   };

   const handleInputChange = (e) => {
         const {id , value} = e.target;

         if(id === 'fullname'){
            setFullname(value);
         }

         if(id === "email"){
            setEmail(value);
         }

         if(id === "password"){
            setPassword(value);
         }

         if(id === "age"){
            setAge(value);
         }
   };

   const theme = useTheme();
   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

   // //Send data to server
   // axios.post('/api/register', userData)
   //    .then(response => {
   //    // Handle the response from the server
   //    })
   //    .catch(error => {
   //    // Handle errors
   //    });
   

   return (
      <>
         <PageContainer>
            <Logo/>
            <Header title='Welcome!' secondaryTitle='Create A New Account' />
            <form onSubmit={handleSubmit}>
               <FormControl
                  sx={isSmallScreen ? { width: '100%' } : { width: '45%' }}
               >
                  <TextField 
                     label='Fullname'
                     id='fullname'
                     type='text'
                     value={fullname}
                     onChange={(e) => handleInputChange(e)}
                     margin='dense'
                     error={!isValid && isDirty}
                     onBlur={() => setIsDirty(true)}
                     variant='outlined'
                     required
                  />
                  <TextField 
                     className={styles.input}
                     label='Email'
                     id='email'
                     type='email'
                     value={email}
                     onChange={(e) => handleInputChange(e)}
                     margin='dense'
                     error={!isValid && isDirty}
                     onBlur={() => setIsDirty(true)}
                     variant='outlined'
                     required
                  />
                  <TextField
                     className={styles.input}
                     label='Password'
                     id='password'
                     type='password'
                     value={password}
                     onChange={(e) => handleInputChange(e)}
                     margin='dense'
                     error={!isValid && isDirty}
                     onBlur={() => setIsDirty(true)}
                     variant='outlined'
                     required
                  />
                  <TextField
                     label='Age'
                     id='age'
                     type='text'
                     value={age}
                     onChange={(e) => handleInputChange(e)}
                     margin='dense'
                     error={!isValid && isDirty}
                     onBlur={() => setIsDirty(true)}
                     variant='outlined'
                     required
                  />
                  <Box sx={{ maxWidth: 250}}>
                     <FormControl fullWidth margin='dense'>
                        <InputLabel id='select-label'>
                           Accessibility Required?
                        </InputLabel>
                        <Select sx={{height: 50}}
                           labelId='demo-simple-select-label'
                           id='isAccessible'
                           value={isAccessible}
                           label='isAccessible'
                           required
                           onChange={(e) => setIsAccessible(e.target.value)}
                           onBlur={() => setIsDirty(true)}
                        >
                           <MenuItem value={'yes'}>Yes</MenuItem>
                           <MenuItem value={'no'}>No</MenuItem>
                        </Select>
                     </FormControl>
                  </Box>
                  <Button onClick={handleSubmit}
                     className={styles.button}
                     type='submit'
                     variant='contained'
                     color='primary'
                     sx={
                        isSmallScreen
                           ? { mt: 2, ml: 2, width: '80%' }
                           : { mt: 1, ml: 14, width: '50%' }
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
                  href='/login'
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
