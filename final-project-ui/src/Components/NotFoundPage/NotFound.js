import React from 'react';
import styles from './NotFound.module.css';
import Box from '@mui/material/Box';
import error from './tourist_man_confused.png';

const NotFound = () => {
   return (
      <>
         <section>
            <div className={styles.title}>
               <h1>Oops!</h1>
               <p className={styles.additional_err}>
                  We Can't Seem To Find The Page You're Looking For.
               </p>
            </div>
            <div className={styles.error}>
               <img
                  className={styles.img_err}
                  src={error}
                  alt='404'
                  width='450'
                  height='450'
               />
            </div>
            <Box
               component='div'
               style={{ margin: '0 auto', maxWidth: 'max-content' }}
            >
               <a
                  href='/'
                  style={{
                     textDecoration: 'none',
                     cursor: 'pointer',
                     fontWeight: 'bold',
                     margin: '0 auto',
                  }}
               >
                  Go Home
               </a>
            </Box>
         </section>
      </>
   );
};

export default NotFound;
