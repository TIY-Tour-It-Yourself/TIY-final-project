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

const tours = [
   {routeid: 1, description: 'route 1', theme: 'Education', experience_level: '1', duration: '00:50:35', evaluation_grade: '4.5'},
   {routeid: 2, description:'route 2', theme: 'Sports', experience_level: '2', duration: '00:50:35', evaluation_grade: '5'},
   {routeid: 3, description:'route 3', theme: 'Food', experience_level: '3', duration: '00:50:35', evaluation_grade: '3.5'}
];

const routes = [
   {routeid: 1, email: '', description: 'route 1', theme: 'Education', pois: '3', experience_level: '1', duration: '00:50:35', evaluation_grade: '4.5'},
   {routeid: 2, email: '', description: 'route 2', theme: 'Sports', pois: '4', experience_level: '2', duration: '00:50:35', evaluation_grade: '5'},
   {routeid: 3, email: '', description: 'route 3', theme: 'Food', pois: '4', experience_level: '3', duration: '00:50:35', evaluation_grade: '3.5'}
];

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
   // const [routes, setRoutes] = useState([]); 
   const [newRoutes, setNewRoutes] = useState([]); 
   const [newTours, setNewTours] = useState([]); 
   // const [tours, setTours] = useState([]); 

   const handleOpenModalRoutes = () => setOpen(true);
   const handleOpenModalTours = () => setOpenTours(true);
   const handleCloseModalRoutes = () => setOpen(false);
   const handleCloseModalTours = () => setOpenTours(false);

   useEffect(() => {
      if (!location.state) {
         navigate('/');
      } else {
         if(!fullName && !email) {
         axios
            .get(`https://tiys.herokuapp.com/api/auth`, {
               headers: {
                  'x-auth-token': location.state.token,
                  'Content-Type': 'application/json',
               },
            })
            .then((response) => {
               // console.log(response.data);
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
               const response = await axios.get(`https://tiys.herokuapp.com/api/tours/${email}`);  
               console.log(response.data);
               setNewTours(response.data);
            } catch (error) {
               console.log(error);
            }  
      }
      fetchData();
   }
   },[email]);

   //Get User's Routes Data
   // useEffect(() => {
   //    const fetchData = async () => {
   //       try{
   //          const response = await axios.get(`https://tiys.herokuapp.com/api/routes/${email}`);  
   //          console.log(response.data);
   //          // setRoutes(response.data);
   //       } catch (error) {
   //          console.log(error);
   //       }  
   //    }
   //    fetchData();
   // },[]);
      
     
   //Get User's first name
   useEffect(() => {
      if(fullName) {
        const fname = fullName.substring(0, fullName.indexOf(' ')); 
        setFirstName(fname);
    }
   },[fullName]);


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

   //TBD: add the creates route by the user / the tour the user chose to participate
   const openRoute = (routeid) => {
      navigate(`/biyalik_map?routeId=${routeid}`, {
         state: { token: location.state.token },
      });
   }

   return (
      <>
         <NavBar activeImage={activeImage} activeLink={activeLink}/>
         {loading ? (<LoadingBar/>) : (
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
                  : { fontSize: '13.5px', mt: 2,  textAlign: 'center' }
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
                  : { fontSize: '13.5px', mt: 5,  textAlign: 'center' }
            }
         >
            <h2>Routes I Built</h2>
         </Typography>
         {!isSmallScreen ? (
         <div className={styles.container}>
            {routes.map(route => 
            <div key={route.routeid} className={styles.record}>
               <div>{route.description}</div>
               <div>{route.theme}</div>
               <div>POIs: {route.pois}</div>
               <div>AR level: {route.experience_level}</div>
               <div>{route.duration}</div> 
               <div>Rank: {route.evaluation_grade}</div>
               <div className={styles.align_right}>
                  <Button sx={{ fontSize: '10px', borderRadius: '20px' }} variant='outlined' onClick={() => openRoute(route.routeid)}>Open Route</Button>
               </div>
            </div>)}
         </div>) : (
            <div className={styles.modal}>
               <Button sx={{ border: '1px solid #2146C7', borderRadius: '20px', width: '40%'}} onClick={handleOpenModalRoutes}>Show Routes</Button>
               <Modal
               open={open}
               onClose={handleCloseModalRoutes}
               aria-labelledby="modal-modal-title"
               aria-describedby="modal-modal-description"
               >
               <Box sx={style}>
                  <div className={styles.container}>
                  {routes.map(route => 
                     <div key={route.routeid} className={styles.record_mobile}>
                        <div><b>{route.description}</b></div>
                        <div><b>Theme: </b>{route.theme}</div>
                        <div><b>POIs: </b>{route.pois}</div>
                        <div><b>AR level: </b>{route.experience_level}</div>
                        <div><b>Duration: </b>{route.duration}</div> 
                        <div><b>Rank: </b>{route.evaluation_grade}</div>
                        <div className={styles.align_right}>
                           <Button sx={{ fontSize: '10px', borderRadius: '20px' }} variant='outlined' onClick={() => openRoute(route.routeid)}>Open Route</Button>
                        </div>
                        <hr/>
                     </div>
                     )}
                     <div style={{ textAlign: 'center' }}><Button className={styles.button} sx={{ fontWeight: 'bold' }} onClick={handleCloseModalRoutes}>Close</Button></div>
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
                  : { fontSize: '13.5px', mt: 12,  textAlign: 'center' }
            }
         >
            <h2>Tours I Took</h2>
         </Typography>
         {!isSmallScreen ? (<div className={styles.container}>
            {newTours.map(tour => 
            <div key={tour.routeid} className={styles.record}>
               <div>{tour.description}</div>
               <div>{tour.theme}</div>
               <div>AR level: {tour.experience_level}</div>
               <div>{tour.duration}</div> 
               <div>Rank: {tour.evaluation_grade}</div>
               <div className={styles.align_right}>
                  <Button sx={{ fontSize: '10px', borderRadius: '20px' }} variant='outlined' onClick={() => openRoute(tour.routeid)}>Open Tour</Button>
               </div>
            </div>)}
         </div> ) : (
           <div className={styles.modal}>
           <Button variant='text' sx={{ border: '1px solid #2146C7', borderRadius: '20px', width: '40%' }} onClick={handleOpenModalTours}>Show Tours</Button>
           <Modal
           open={openTours}
           onClose={handleCloseModalTours}
           aria-labelledby="modal-modal-title"
           aria-describedby="modal-modal-description"
           >
           <Box sx={style}>
              <div className={styles.container}>
              {tours.map(tour => 
                 <div key={tour.routeid} className={styles.record_mobile}>
                    <div><b>{tour.description}</b></div>
                    <div><b>Theme: </b>{tour.theme}</div>
                    <div><b>AR level: </b>{tour.experience_level}</div>
                    <div><b>Duration: </b>{tour.duration}</div> 
                    <div><b>Rank: </b>{tour.evaluation_grade}</div>
                    <div className={styles.align_right}>
                           <Button sx={{ fontSize: '10px', borderRadius: '20px' }} variant='outlined' onClick={() => openRoute(tour.routeid)}>Open Tour</Button>
                     </div>
                    <hr/>
                 </div>
                 )}
                 <div style={{ textAlign: 'center' }}><Button sx={{ fontWeight: 'bold' }} onClick={handleCloseModalTours}>Close</Button></div>
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
