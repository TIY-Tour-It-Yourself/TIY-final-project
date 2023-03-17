import React from 'react';
import styles from './NotFound.module.css';
import { Link, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import error from './tourist_man_confused.png';

const NotFound = () => {
   const navigate = useNavigate();

   return (
      <>
         <section>
            <div className={styles.title}>
               <h1>Oops!</h1>
               <p className={styles.additional_err}>We Can't Seem To Find The Page You're Looking For.</p>
            </div>
            <div className={styles.error}>
               <img className={styles.img_err} src={error} alt="404" width='450' height='450'/>
            </div>
            <Box component='div' style={{margin: '0 auto', maxWidth: 'max-content', cursor: 'pointer'}} ><Link style={{ textDecoration: 'none', cursor: 'pointer', margin: '0 auto'}} onClick={() => { navigate('/dashboard')}}>Go Home</Link></Box>
         </section>
      </>
   );
};

export default NotFound;
