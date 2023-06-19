import * as React from 'react';
import {
   FormControl,
   Grid,
   InputLabel,
   MenuItem,
   Select,
   TextField,
   Button,
} from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function Update_User(props) {
   const { selectedUser, onCancel } = props;
   const location = useLocation();
   const navigate = useNavigate();

   const [fname, setFname] = useState(selectedUser.fname);
   const [email, setEmail] = useState(selectedUser.email);
   const [password, setPassword] = useState('');
   const [isValid, setIsValid] = useState(false);
   const [isDirty, setIsDirty] = useState(false);
   const [isFormValid, setIsFormValid] = useState(false);


   const handleSubmit = async (e) => {
      e.preventDefault();

      if (fname && password) {
         try {
            const response = await axios.put(
               'https://tiys.herokuapp.com/api/users',
               {
                  fname,
                  email,
                  password,
               }
            );

            setIsFormValid(true);

            if (response.status === 200) {
               console.log('OK');
            } else {
               console.log('Status is not 200');
            }
            // Close the modal
            onCancel();

            // Refresh the page
            window.location.reload();
         } catch (err) {
            console.log(err.response.data.errors[0]);

            if (err.response.data.errors[0].msg === 'User already exists') {
               alert('Email already exists.');
            } else {
               alert('Invalid Credentials.');
            }
         }
      } else {
         alert('All fields are required.');
         setIsFormValid(false);
      }
   };

   const handleInputChange = (e) => {
      const { name, value } = e.target;

      if (name === 'fname') {
         setFname(value);
      }

      if (name === 'email') {
         setEmail(value);
      }

      if (name === 'password') {
         setPassword(value);
      }
   };

   return (
      <>
         <div style={{ height: '100%', marginBottom: '40px' }}>
            <h2> Update User: </h2>{' '}
            <form onSubmit={handleSubmit}>
               <Grid
                  container
                  spacing={2}
                  sx={{
                     width: '100%',
                     height: '50%',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                  }}
               >
                  <Grid item xs={12}>
                     <TextField
                        name='fname'
                        label='Full Name'
                        fullWidth
                        value={fname}
                        error={!isValid && isDirty}
                        onBlur={() => setIsDirty(true)}
                        onChange={(e) => handleInputChange(e)}
                        required
                     />{' '}
                  </Grid>{' '}
                  <Grid item xs={12}>
                     <TextField
                        name='email'
                        label='Email'
                        fullWidth
                        value={email}
                        onChange={(e) => handleInputChange(e)}
                        required
                     />{' '}
                  </Grid>{' '}
                  <Grid item xs={12}>
                     <TextField
                        name='password'
                        label='Password'
                        fullWidth
                        value={password}
                        onChange={(e) => handleInputChange(e)}
                        required
                     />{' '}
                  </Grid>{' '}
                  <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
                     <Button variant='contained' color='primary' type='submit'>
                        Update{' '}
                     </Button>{' '}
                  </Grid>{' '}
               </Grid>{' '}
            </form>{' '}
         </div>{' '}
      </>
   );
}

export default Update_User;
