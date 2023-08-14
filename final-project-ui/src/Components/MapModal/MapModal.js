import React, { useState } from 'react';
import styles from './MapModal.module.css';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const MapModal = () => {
   const [open, setOpen] = useState(true);

   const closeModal = () => {
      setOpen(false);
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
            onClose={closeModal}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
         >
            <Box sx={style}>
               <div className={styles.container}>
                  <section className={styles.modal}>
                     <div>
                        <h2>A Few Guiding Tips:</h2>
                     </div>
                     <ol>
                        <li>
                           Follow the{' '}
                           <span className={styles.green}>green</span> arrow
                           which signifies your current location and tells you
                           which direction to go on the map.
                        </li>
                        <br />
                        <li>
                           Each <span className={styles.red}>red</span> pin
                           signifies a specific location of the tour. Click on
                           it and you'll see the AR icon (from AR level:
                           'Advanced') and the Rank icon.
                        </li>
                        <br />
                        <li className={styles.third}>Enjoy! :)</li>
                        <br />
                     </ol>
                  </section>
                  <div style={{ textAlign: 'center' }}>
                     <Button
                        variant='outlined'
                        sx={{ fontWeight: 'bold', borderRadius: '17px' }}
                        onClick={closeModal}
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

export default MapModal;
