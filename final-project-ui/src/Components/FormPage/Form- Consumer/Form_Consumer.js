import React, { useState, useEffect } from 'react';
import styles from './Form_Consumer.module.css';
import axios from 'axios';
import { Button, Typography, Box, Grid } from '@mui/material';
import NavBar from '../../Additionals/NavBar/NavBar';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useNavigate } from 'react-router-dom';
import ARFirstLevel from './ar_imgs/boy_with_mobile_level_2.jpg';
import ARSecondLevel from './ar_imgs/ar_img_1.jpg';
import Bialik from './routes_imgs/tour_bialik.jpg';
import Culinary from './routes_imgs/baklava_pic.jpg';

const arImgs = [
   { id: 1, name: 'Intermediate', src: ARFirstLevel },
   { id: 2, name: 'Advanced', src: ARSecondLevel },
];

const Form_Consumer = () => {
   const [formTheme, setFormTheme] = useState('');
   const [themeSelectedId, setThemeSelectedId] = useState('');
   const [selectedLevelId, setSelectedLevelId] = useState('');
   const [isFormValid, setIsFormValid] = useState(false);
   const [routeChosen, setRouteChosen] = useState('');
   const [routes, setRoutes] = useState('');
   const [filteredData, setFilteredData] = useState([]);

   const theme = useTheme();
   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
   
   const navigate = useNavigate();

   useEffect(() => {
      if (routeChosen) {
        navigate(`/biyalik_map?routeId=${routeChosen}`);
      }
    }, [routeChosen, navigate]);

   //Get Themes from DB
   useEffect(() => {
      axios
         .get('https://tiys.herokuapp.com/api/themes')
         .then((response) => {
            setFormTheme(response.data);
         })
         .catch((err) => {
            console.log(err);
         });
   }, []);

   //Get Routes from DB
   useEffect(() => {
      const filterData = async () => {
         try {
            // Make an API request to fetch the routes data
            const response = await axios.get(
               'https://tiys.herokuapp.com/api/routes'
            );
            setRoutes(response.data);

            // Check if both Theme and ARlevel have been selected
            if (themeSelectedId && selectedLevelId) {
               // Filter the data based on the selected values
               const filtered = response.data.filter((route) => {
                  return (
                     route.theme.themeid === themeSelectedId &&
                     route.experience_level === selectedLevelId
                     );
               });
               // Update the state with the filtered data
               setFilteredData(filtered);
               console.log(`filtered: ${filtered.length}`);
            } else {
               //If either theme or level is not selected, set filtered data to null
               setFilteredData(null);
            }
         } catch (error) {
            console.log(error);
         }
      };

      filterData();
   }, [themeSelectedId, selectedLevelId]);
   
   //While data hasn't become an array yet- keep loading
   if (!Array.isArray(formTheme) || !Array.isArray(routes)) {
      return <div>Loading...</div>;
   }
   
   //Redirect to chosen route on the map
   const chooseRoute = (routeid) => {
      if (selectedLevelId && themeSelectedId) {
         console.log(routeid);
         setRouteChosen(routeid);
         setIsFormValid(true);
         //Navigate to interactive map
         // navigate(`/biyalik_map?themeSelectedId=${themeSelectedId}&selectedLevelId=${selectedLevelId}`);
         // navigate(`/biyalik_map?routeId=${routeChosen}`);
      } else {
         setIsFormValid(false);
      }
   };

   const setSelectedTheme = (value) => {
      if (themeSelectedId !== '') {
            setThemeSelectedId(value);
            // themeSelected.backgroundColor = '#BAD7E9';
         } else {
            setThemeSelectedId(value);
         }
      };
   
      const handleARExperience = (arId) => {
         setSelectedLevelId(arId);
      };

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
               {formTheme.map((theme) => (
                     <Button
                     key={theme.themeid}
                     onClick={() => setSelectedTheme(theme.themeid)}
                     value={theme}
                     variant={
                        themeSelectedId === theme.themeid
                           ? 'contained'
                           : 'outlined'
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
                     {theme.theme}
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
                        style={{
                           border:
                              selectedLevelId === arImg.id
                                 ? '2px solid rgb(83, 125, 203)'
                                 : '1px dashed rgb(83, 125, 203)',
                        }}
                        onClick={() => handleARExperience(arImg.id)}
                        alt={arImg.name}
                        width='150'
                        height='150'
                     />
                     <div className={styles.arlevel_name}
                     >
                        <span>{arImg.name}</span>
                     </div>
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
         {!filteredData ? (
            <div className={styles.routes_imgs}>
               {routes.map((route) => (
                  <div
                     style={{ cursor: 'pointer' }}
                     key={route.routeid}
                     onClick={() => chooseRoute(route.routeid)}
                  >
                     <img src={Bialik} alt={route.description} />
                     <Typography
                        component='p'
                        sx={
                           !isSmallScreen
                              ? {
                                   fontStyle: 'italic',
                                   fontSize: '0.9rem',
                                   ml: 1.5,
                                }
                              : { fontSize: '0.8rem', fontStyle: 'italic' }
                        }
                     >
                        {route.description}
                     </Typography>
                  </div>
               ))}
            </div>
         ) : (
            <div className={styles.routes_imgs}>
               {filteredData.map((route) => (
                  <div
                     style={{ cursor: 'pointer' }}
                     key={route.routeid}
                     onClick={(e) => chooseRoute(route.routeid)}
                  >
                     <img src={Bialik} alt={route.description} />
                     <Typography
                        component='p'
                        sx={
                           !isSmallScreen
                              ? {
                                   fontStyle: 'italic',
                                   fontSize: '0.9rem',
                                   ml: 1.5,
                                }
                              : { fontSize: '0.8rem', fontStyle: 'italic' }
                        }
                     >
                        {route.description}
                     </Typography>
                  </div>
               ))}
            </div>
         )}
      </>
   );
};

export default Form_Consumer;
