import React, { useState, useEffect } from 'react';
import styles from './Form_Consumer.module.css';
import axios from 'axios';
import { Button, Typography, Box, Link } from '@mui/material';
import NavBar from '../../Additionals/NavBar/NavBar';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useNavigate } from 'react-router-dom';
import ARFirstLevel from './ar_imgs/boy_with_mobile_level_2.jpg';
import ARSecondLevel from './ar_imgs/ar_img_1.jpg';
import Bialik from './routes_imgs/tour_bialik.jpg';

const themes = [
   { id: 1, name: 'Sport' },
   { id: 2, name: 'Music' },
   { id: 3, name: 'Culture' },
   { id: 4, name: 'Culinary' },
   { id: 5, name: 'History' },
   { id: 6, name: 'Education' },
];

const routes = [
   {
      routeid: 1,
      image: Bialik,
      description: 'Historical places in Ramat Gan',
      pois: [1, 2, 3, 4],
      evaluation_grade: '0',
      experience_level: '2',
      themeid: '5',
      url: '',
   },
   {
      routeid: 2,
      image: Bialik,
      description: 'Culinary experiences in Ramat Gan',
      pois: [1, 2, 3, 4],
      evaluation_grade: '5',
      experience_level: '1',
      themeid: '3',
      url: '',
   },
];

const arImgs = [
   { id: 1, name: 'Intermediate', src: ARFirstLevel },
   { id: 2, name: 'Advanced', src: ARSecondLevel },
];

const Form_Consumer = () => {
   const [experience, setExperience] = useState('');
   const [formTheme, setFormTheme] = useState(null);
   const [selected, setSelected] = useState('');
   const [levelSelected, setLevelSelected] = useState(true);
   const [isFormValid, setIsFormValid] = useState(false);

   const theme = useTheme();
   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

   const navigate = useNavigate();

   const setSelectedTheme = (value) => {
      if (selected.indexOf(value) > -1) {
         setSelected(value);
         // selected.backgroundColor = '#BAD7E9';
      } else {
         setSelected(value);
      }
   };

   const handleARExperience = (arLevel) => {
      if (!levelSelected) {
         setLevelSelected(!levelSelected);
      }
      console.log(levelSelected);
      console.log(arLevel);
   };

   const chooseRoute = (routeid) => {
      if (experience && formTheme) {
         setIsFormValid(true);
         //Navigate to interactive map
         navigate('/bialik');
      }
   };
   // const handleSubmit = (event) => {
   //    event.preventDefault();

   //    //If all fields are filled
   //    if (experience && formTheme) {
   //       setIsFormValid(true);
   //       navigate('/suggestions');
   //    } else {
   //       alert('All fields are required.');
   //       setIsFormValid(false);
   //    }
   // };

   //Get Themes from DB
   useEffect(() => {
      axios
         .get('https://tiys.herokuapp.com/api/routes')
         .then((response) => {
            setFormTheme(response.data);
         })
         .catch((err) => {
            console.log(err);
         });
   }, []);

   return (
      <>
         <NavBar />
         <Typography component='div' className={styles.title}>
            <h1 style={!isSmallScreen ? {} : { fontSize: '25px' }}>
               Choose Your Tour
            </h1>
         </Typography>
         <Box component='div' className={styles.theme_div}>
            <Typography
               sx={
                  isSmallScreen
                     ? { fontSize: '1rem', marginLeft: '18%' }
                     : { fontSize: '1.25rem' }
               }
            >
               <b>Choose Tour Theme:</b>
            </Typography>

            {/* Render themes through map */}
            <Box
               component='div'
               className={styles.themes}
               sx={
                  isSmallScreen
                     ? {
                          display: 'flex',
                          flexWrap: 'wrap',
                          maxWidth: '90%',
                          padding: '3px',
                          marginTop: '2px',
                          justifyContent: 'center',
                       }
                     : {
                          maxWidth: 'max-content',
                       }
               }
            >
               {themes.map((tourTheme) => (
                  <Button
                     key={tourTheme.id}
                     onClick={() => setSelectedTheme(tourTheme.name)}
                     value={tourTheme}
                     variant={
                        selected === tourTheme.name ? 'contained' : 'outlined'
                     }
                     sx={
                        !isSmallScreen
                           ? {
                                borderRadius: '20px',
                                height: '30px',
                                marginLeft: 1,
                                marginTop: 2,
                             }
                           : {
                                marginLeft: 1.5,
                                marginBottom: 1,
                                height: '30px',
                                borderRadius: '20px',
                             }
                     }
                  >
                     {tourTheme.name}
                  </Button>
               ))}
            </Box>
         </Box>
         <Box component='div' className={styles.AR_exp_div}>
            <Typography
               sx={
                  isSmallScreen
                     ? { fontSize: '1rem', ml: 1, mt: 2 }
                     : { fontSize: '1.25rem', mt: 2 }
               }
            >
               <b>Choose AR Experience:</b>
            </Typography>
            <div className={styles.ar_imgs}>
               {arImgs.map((arImg) => (
                  <div key={arImg.id}>
                     <img
                        value={arImg}
                        src={arImg.src}
                        onClick={() => handleARExperience(arImg.name)}
                        alt={arImg.name}
                        width='150'
                        height='150'
                     />
                  </div>
               ))}
            </div>
         </Box>
         {/* Routes List */}
         <Box>
            <div className={styles.routes_title}>
               <Typography
                  component='h3'
                  sx={
                     isSmallScreen
                        ? { fontSize: '1rem' }
                        : { fontSize: '1.25rem' }
                  }
               >
                  <b>Available Routes:</b>
               </Typography>
            </div>
         </Box>
         <div className={styles.routes_imgs}>
            {routes.map((route) => (
               <div
                  style={{ }}
                  key={route.routeid}
                  onClick={() => chooseRoute(route.routeid)}
               >
                  <img
                     src={route.image}
                     alt={route.description}
                  />
               </div>
            ))}
         </div>
      </>
   );
};

export default Form_Consumer;
