import React, { useState, useEffect } from 'react';
import styles from './Form_Consumer.module.css';
import axios from 'axios';
import { Button, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import Grid from '../../Additionals/Grid/Grid';
import NavBar from '../../Additionals/NavBar/NavBar';
import LoadingBar from '../../Additionals/LoadingBar/LoadingBar';
import useMediaQuery from '@mui/material/useMediaQuery';
import ARFirstLevel from './ar_imgs/boy_with_mobile_level_2.jpg';
import ARSecondLevel from './ar_imgs/ar_img_1.jpg';
import ARThirdLevel from './ar_imgs/ar_level_3_elephant.png';
import Bialik from './routes_imgs/tour_bialik.jpg';
import Parks from './routes_imgs/yom_kipur_garden.jpg';
import Culinary from './routes_imgs/baklava_pic.jpg';

const arImgs = [
   { id: 1, name: 'Intermediate', src: ARFirstLevel },
   { id: 2, name: 'Advanced', src: ARSecondLevel },
   { id: 3, name: 'Professional', src: ARThirdLevel }
];

const Form_Consumer = () => {
   const [formTheme, setFormTheme] = useState('');
   // const [displayPage, setDisplayPage] = useState(false);
   const [themeSelectedId, setThemeSelectedId] = useState('');
   const [selectedLevelId, setSelectedLevelId] = useState('');
   const [isFormValid, setIsFormValid] = useState(false);
   const [routeChosen, setRouteChosen] = useState('');
   const [routes, setRoutes] = useState('');
   const [filteredData, setFilteredData] = useState([]);
   const [isLoading, setIsLoading] = useState(false);
   const [token, setToken] = useState('');

   const theme = useTheme();
   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
   const navigate = useNavigate();
   const location = useLocation();

   useEffect(() => {
      console.log(location);
      if(!location.state) {
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

   useEffect(() => {
      if (routeChosen) {
        navigate(`/biyalik_map?routeId=${routeChosen}`, { state : { token: location.state.token}});
      }
    }, [routeChosen, navigate]);

   //Get Themes from DB
   useEffect(() => {
      setIsLoading(true);
      axios
         .get('https://tiys.herokuapp.com/api/themes')
         .then((response) => {
            setFormTheme(response.data);
            setIsLoading(false);
         })
         .catch((err) => {
            console.log(err);
            setIsLoading(false);
         });
   }, []);

   //Get Routes from DB
   useEffect(() => {
      setIsLoading(true);
      const filterData = async () => {
         try {
            // Make an API request to fetch the routes data
            const response = await axios.get(
               'https://tiys.herokuapp.com/api/routes'
            );
            setIsLoading(false);
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
               setIsLoading(false);
            }
         } catch (error) {
            console.log(error);
            setIsLoading(false);
         }
      };

      filterData();
   }, [themeSelectedId, selectedLevelId]);
   
   //While data hasn't become an array yet- keep loading
   if (!Array.isArray(formTheme) || !Array.isArray(routes)) {
      return <LoadingBar/>;
   }
   
   //Redirect to chosen route on the map
   const chooseRoute = (routeid) => {
      if (selectedLevelId && themeSelectedId) {
         console.log(routeid);
         setRouteChosen(routeid);
         setIsFormValid(true);
      } else {
         alert("Theme and AR Experience must be chosen.");
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
         <NavBar/>
         <Typography component='div' className={styles.title}>
            <h1 style={!isSmallScreen ? {} : { fontSize: '25px' }}>
               Choose Your Tour
            </h1>
         </Typography>
         <Box component='div' className={styles.theme_div}>
            <Typography
               sx={
                  isSmallScreen
                     ? { fontSize: '1rem', ml: 10, mb: 1 }
                     : { fontSize: '1.25rem' }
               }
            >
               <span><b>Choose Tour Theme:</b></span>
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
            {isSmallScreen ? ( <Grid objArray={formTheme.map((theme) => (
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
                                marginBottom: 1
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
               ))}/> ) : (formTheme.map((theme) => (
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
                             marginBottom: 1
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
               </Button>)))} 
            </Box>
         </Box>
         <Box component='div' className={styles.AR_exp_div}>
            <Typography
               sx={
                  isSmallScreen
                     ? { fontSize: '1rem', ml: 1, mt: 2, mb: 1 }
                     : { fontSize: '1.25rem', mt: 2 }
               }
            >
               <span><b>Choose AR Experience:</b></span>
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
                  component='div'
                  sx={
                     isSmallScreen
                        ? { fontSize: '1.05rem', ml: 1, mt: 4, maxWidth: 'max-content' }
                        : { fontSize: '1.25rem' }
                  }
               >
                  <span><b>Available Routes:</b></span>
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
