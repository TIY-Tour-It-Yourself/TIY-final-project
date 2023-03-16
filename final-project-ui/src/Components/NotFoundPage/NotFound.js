import React from 'react';
import styles from './NotFound.module.css';
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const NotFound = () => {
   const navigate = useNavigate();

   const theme = useTheme();
   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

   const handleSubmit = (e) => {
      e.preventDefault();
      navigate('/dashboard');
   };
   return (
      <>
         <section>
            <div className={styles.title}>
               <h1>Oops!</h1>
               <p>We Can't Seem To Find The Page You're Looking For.</p>
            </div>
            <Button
               type='submit'
               variant='contained'
               color='primary'
               onClick={handleSubmit}
               sx={
                isSmallScreen
                   ? { mt: 5, ml: 7, width: '60%' }
                   : { mt: 1, ml: 76, width: '20%' }
             }
             style={ isSmallScreen ? {
                borderRadius: 20,
                backgroundColor: '#2471A3',
                fontSize: '13px',
             } : {
                borderRadius: 20,
                backgroundColor: '#2471A3',
                fontSize: '15px',
            }}
            >
               Go Back Home
            </Button>
         </section>
      </>
   );
};

export default NotFound;
