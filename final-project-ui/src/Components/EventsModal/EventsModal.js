import React, { useState, useEffect, useCallback } from 'react';
import styles from './EventsModal.module.css';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const EventsModal = (props) => {
   const [open, setOpen] = useState(true);
   const navigate = useNavigate();
   const location = useLocation();
   const theme = useTheme();
   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

   useEffect(() => {
      if (!location.state) {
         navigate('/');
      } else {
         axios
            .get(`https://tiys.herokuapp.com/api/auth`, {
               headers: {
                  'x-auth-token': location.state.token,
                  'Content-Type': 'application/json',
               },
            })
            .then((response) => {
               // console.log(response.data);
            })
            .catch((error) => {
               console.error('Error fetching user: ', error);
            });
      }
   }, [location.state]);

   const handleCloseModal = () => {
      console.log('back');
      setOpen(false);
      navigate(-1);
      // navigate('/form_producer', { state: { token: location.state.token } });
   };

   //Modal Style
   const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '70%',
      height: '75%',
      borderRadius: '30px',
      bgcolor: 'background.paper',
      border: '1px solid grey',
      overflow: 'scroll',
      boxShadow: 24,
      p: 4,
   };

   return (
      <div className={styles.modal}>
         <Modal
            open={open}
            onClose={handleCloseModal}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
         >
            <Box sx={style}>
               <div>
                  <section className={styles.modal}>
                     <Typography
                        component='div'
                        sx={
                           isSmallScreen
                              ? { fontWeight: 'bold', fontSize: '1.25rem' }
                              : { fontWeight: 'bold', fontSize: '1.5rem' }
                        }
                     >
                        <span>Choose Events to add to your Tour:</span>
                     </Typography>
                     <div>
                        <Typography
                           component='div'
                           sx={
                              isSmallScreen
                                 ? {
                                      fontWeight: 'bold',
                                      fontSize: '0.9rem',
                                      mt: 2,
                                   }
                                 : {
                                      fontWeight: 'bold',
                                      fontSize: '1.05rem',
                                      mt: 3,
                                   }
                           }
                        >
                           <span>
                              Scroll down to see events on specific dates
                           </span>
                        </Typography>
                     </div>
                     <Box
                        component='div'
                        sx={{
                           display: 'flex',
                           flexWrap: 'wrap',
                           justifyContent: 'center',
                           mb: 3,
                        }}
                     >
                        <div className={styles.event_card}>
                           <div className={styles.inner_card}></div>
                        </div>
                     </Box>
                  </section>
                  <div style={{ textAlign: 'center' }}>
                     <Button
                        variant='outlined'
                        sx={{ fontWeight: 'bold', borderRadius: '17px' }}
                        onClick={handleCloseModal}
                     >
                        Close
                     </Button>
                  </div>
               </div>
            </Box>
         </Modal>
      </div>
   );
};

export default EventsModal;
