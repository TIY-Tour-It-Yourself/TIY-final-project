import React, { useState, useEffect } from 'react';
import styles from './Tours.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../Additionals/NavBar/NavBar';
import LoadingBar from '../Additionals/LoadingBar/LoadingBar';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { Link } from 'react-router-dom';

const Tours = () => {
   const location = useLocation();
   const navigate = useNavigate();
   const theme = useTheme();
   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

   const [activeImage, setActiveImage] = useState(null);
   const [activeLink, setActiveLink] = useState(null);
   const [email, setEmail] = useState('');
   const [fullName, setFullName] = useState('');
   const [firstName, setFirstName] = useState('');
   const [loading, setLoading] = useState(true);
   const [open, setOpen] = useState(false);
   const [openTours, setOpenTours] = useState(false);
   const [newRoutes, setNewRoutes] = useState([]);
   const [newTours, setNewTours] = useState([]);

   const handleOpenModalRoutes = () => setOpen(true);
   const handleOpenModalTours = () => setOpenTours(true);
   const handleCloseModalRoutes = () => setOpen(false);
   const handleCloseModalTours = () => setOpenTours(false);

   useEffect(() => {
      if (!location.state) {
         navigate('/');
      } else {
         if (!fullName && !email) {
            axios
               .get(`https://tiys.herokuapp.com/api/auth`, {
                  headers: {
                     'x-auth-token': location.state.token,
                     'Content-Type': 'application/json',
                  },
               })
               .then((response) => {
                  setEmail(response.data.email);
                  setFullName(response.data.fname);
                  setActiveImage(3);
                  setActiveLink(2);
                  setLoading(false);
               })
               .catch((error) => {
                  console.error('Error fetching user: ', error);
                  setLoading(false);
               });
         }
      }
   }, [location.state]);

   //Get User's Tours Data
   useEffect(() => {
      if (email) {
         const fetchData = async () => {
            try {
               const response = await axios.get(
                  `https://tiys.herokuapp.com/api/tours/${email}`
               );
               setNewTours(response.data);
            } catch (error) {
               console.log(error);
            }
         };
         fetchData();
      }
   }, [email]);

   //Get User's Routes Data
   useEffect(() => {
      if (email) {
         const fetchData = async () => {
            try {
               const response = await axios.get(
                  `https://tiys.herokuapp.com/api/routes/users/${email}`
               );
               setNewRoutes(response.data);
            } catch (error) {
               console.log(error);
            }
         };
         fetchData();
      }
   }, [email]);

   //Get User's first name
   useEffect(() => {
      if (fullName) {
         const fname = fullName.substring(0, fullName.indexOf(' '));
         setFirstName(fname);
      }
   }, [fullName]);

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

   const openRoute = (routeid) => {
      navigate(`/map_builder?routeId=${routeid}`, {
         state: { token: location.state.token },
      });
   };

   return (
      <>
         <NavBar activeImage={activeImage} activeLink={activeLink} />
         {loading ? (
            <LoadingBar />
         ) : (
            <>
               <Typography
                  component='div'
                  sx={
                     !isSmallScreen
                        ? {
                             display: 'flex',
                             flexDirection: 'row',
                             ml: 13,
                             mt: '6%',
                          }
                        : { fontSize: '13.5px', mt: 2, textAlign: 'center' }
                  }
               >
                  <h1>{firstName}'s Tours</h1>
               </Typography>
               <Typography
                  component='div'
                  sx={
                     !isSmallScreen
                        ? {
                             display: 'flex',
                             flexDirection: 'row',
                             ml: 13,
                             mt: '4%',
                          }
                        : { fontSize: '13.5px', mt: 5, textAlign: 'center' }
                  }
               >
                  <h2>Routes I Built</h2>
               </Typography>
               {!isSmallScreen ? (
                  <div className={styles.container}>
                     {newRoutes.map((route) => (
                        <div key={route.routeid} className={styles.record}>
                           <div>{route.description}</div>
                           <div>{route.theme.theme}</div>
                           <div>POIs: {route.pois.length}</div>
                           <div>AR level: {route.experience_level}</div>
                           <div>Rank: {route.evaluation_grade.toFixed(1)}</div>
                           <div className={styles.align_right}>
                              <Button
                                 sx={{
                                    fontSize: '10px',
                                    borderRadius: '20px',
                                    border: '1px solid rgb(65, 63, 63)',
                                 }}
                                 variant='outlined'
                                 onClick={() => openRoute(route.routeid)}
                              >
                                 Open Route
                              </Button>
                           </div>
                        </div>
                     ))}
                  </div>
               ) : (
                  <div className={styles.modal}>
                     <Button
                        sx={{
                           border: '1px solid #2146C7',
                           borderRadius: '20px',
                           width: '40%',
                        }}
                        onClick={handleOpenModalRoutes}
                     >
                        Show Routes
                     </Button>
                     <Modal
                        open={open}
                        onClose={handleCloseModalRoutes}
                        aria-labelledby='modal-modal-title'
                        aria-describedby='modal-modal-description'
                     >
                        <Box sx={style}>
                           <div className={styles.container}>
                              {newRoutes.map((route) => (
                                 <div
                                    key={route.routeid}
                                    className={styles.record_mobile}
                                 >
                                    <div>
                                       <b>{route.description}</b>
                                    </div>
                                    <div>
                                       <b>Theme: </b>
                                       {route.theme.theme}
                                    </div>
                                    <div>
                                       <b>POIs:</b> {route.pois.length}
                                    </div>
                                    <div>
                                       <b>AR level:</b> {route.experience_level}
                                    </div>
                                    <div>
                                       <b>Rank:</b>{' '}
                                       {route.evaluation_grade.toFixed(1)}
                                    </div>
                                    <div className={styles.align_right}>
                                       <Button
                                          sx={{
                                             fontSize: '10px',
                                             borderRadius: '20px',
                                          }}
                                          variant='outlined'
                                          onClick={() =>
                                             openRoute(route.routeid)
                                          }
                                       >
                                          Open Route
                                       </Button>
                                    </div>
                                    <hr />
                                 </div>
                              ))}
                              <div style={{ textAlign: 'center' }}>
                                 <Button
                                    className={styles.button}
                                    sx={{ fontWeight: 'bold' }}
                                    onClick={handleCloseModalRoutes}
                                 >
                                    Close
                                 </Button>
                              </div>
                           </div>
                        </Box>
                     </Modal>
                  </div>
               )}
               <Typography
                  component='div'
                  sx={
                     !isSmallScreen
                        ? {
                             display: 'flex',
                             flexDirection: 'row',
                             ml: 13,
                             mt: '6%',
                          }
                        : { fontSize: '13.5px', mt: 12, textAlign: 'center' }
                  }
               >
                  <h2>Tours I Took</h2>
               </Typography>
               {!isSmallScreen ? (
                  <div className={styles.container}>
                     {newTours.map((tour) => (
                        <div key={tour._id} className={styles.record}>
                           <div>{tour.description}</div>
                           <div>{tour.theme}</div>
                           <div>AR level: {tour.experience_level}</div>
                           <div>POIs: {tour.pois.length}</div>
                           <div>{tour.duration}</div>
                           <div>Rank: {tour.evaluation_grade.toFixed(1)}</div>
                           <div className={styles.align_right}>
                              <Button
                                 sx={{
                                    fontSize: '10px',
                                    borderRadius: '20px',
                                    border: '1px solid rgb(65, 63, 63)',
                                 }}
                                 variant='outlined'
                                 onClick={() => openRoute(tour.routeid)}
                              >
                                 Open Tour
                              </Button>
                           </div>
                        </div>
                     ))}
                  </div>
               ) : (
                  <div className={styles.modal}>
                     <Button
                        variant='text'
                        sx={{
                           border: '1px solid #2146C7',
                           borderRadius: '20px',
                           width: '40%',
                        }}
                        onClick={handleOpenModalTours}
                     >
                        Show Tours
                     </Button>
                     <Modal
                        open={openTours}
                        onClose={handleCloseModalTours}
                        aria-labelledby='modal-modal-title'
                        aria-describedby='modal-modal-description'
                     >
                        <Box sx={style}>
                           <div className={styles.container}>
                              {newTours.map((tour) => (
                                 <div
                                    key={tour._id}
                                    className={styles.record_mobile}
                                 >
                                    <div>
                                       <b>{tour.description}</b>
                                    </div>
                                    <div>
                                       <b>Theme: </b>
                                       {tour.theme}
                                    </div>
                                    <div>
                                       <b>AR level: </b>
                                       {tour.experience_level}
                                    </div>
                                    <div>
                                       <b>POIs: </b> {tour.pois.length}
                                    </div>
                                    <div>
                                       <b>Duration: </b> {tour.duration}
                                    </div>
                                    <div>
                                       <b>Rank: </b>{' '}
                                       {tour.evaluation_grade.toFixed(1)}
                                    </div>
                                    <div className={styles.align_right}>
                                       <Button
                                          sx={{
                                             fontSize: '10px',
                                             borderRadius: '20px',
                                          }}
                                          variant='outlined'
                                          onClick={() =>
                                             openRoute(tour.routeid)
                                          }
                                       >
                                          Open Tour
                                       </Button>
                                    </div>
                                    <hr />
                                 </div>
                              ))}
                              <div style={{ textAlign: 'center' }}>
                                 <Button
                                    sx={{ fontWeight: 'bold' }}
                                    onClick={handleCloseModalTours}
                                 >
                                    Close
                                 </Button>
                              </div>
                           </div>
                        </Box>
                     </Modal>
                  </div>
               )}
            </>
         )}
      </>
   );
};

export default Tours;
