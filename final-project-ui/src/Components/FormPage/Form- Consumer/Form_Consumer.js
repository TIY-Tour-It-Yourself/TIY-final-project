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
import Star from './routes_imgs/star_32.png';
import Edit from './routes_imgs/edit_rounded.png';

const arImgs = [
   { id: 1, name: 'Intermediate', src: ARFirstLevel },
   { id: 2, name: 'Advanced', src: ARSecondLevel },
   { id: 3, name: 'Professional', src: ARThirdLevel },
];

const Form_Consumer = () => {
   const [formTheme, setFormTheme] = useState('');
   const [themeSelectedId, setThemeSelectedId] = useState('');
   const [selectedLevelId, setSelectedLevelId] = useState('');
   const [selectedThemeName, setSelectedThemeName] = useState('');
   const [description, setDescription] = useState('');
   const [isFormValid, setIsFormValid] = useState(false);
   const [routeChosen, setRouteChosen] = useState('');
   const [routes, setRoutes] = useState('');
   const [filteredData, setFilteredData] = useState([]);
   const [isLoading, setIsLoading] = useState(false);

   const theme = useTheme();
   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
   const navigate = useNavigate();
   const location = useLocation();

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

   //Redirect to Interactive Map page
   useEffect(() => {
      if (routeChosen) {
         handleMapPage(routeChosen);
      }
   }, [routeChosen]);

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
               'https://tiys.herokuapp.com/api/routes/users/admin@tiy.com'
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
      return <LoadingBar />;
   }

   //Redirect to chosen route on the map
   const chooseRoute = (routeId, routeDescription) => {
      // const chooseRoute = (routeid) => {
      if (selectedLevelId && themeSelectedId) {
         setRouteChosen(routeId);
         setDescription(routeDescription);
         // setSelectedThemeName(routeTheme);
         setIsFormValid(true);
      } else {
         alert('Theme and AR Experience must be chosen.');
         setIsFormValid(false);
      }
   };

   const setSelectedTheme = (themeId, themeName) => {
      if (themeSelectedId !== '' && selectedThemeName !== '') {
         // if (themeSelectedId !== '') {
         setThemeSelectedId(themeId);
         setSelectedThemeName(themeName);
      } else {
         setThemeSelectedId(themeId);
         setSelectedThemeName(themeName);
      }
   };

   const handleARExperience = (arId) => {
      setSelectedLevelId(arId);
   };

   //Redirect to Modifier Form page
   const handleModifierForm = (routeId, routeDescription) => {
      if (selectedLevelId && themeSelectedId) {
         navigate(
            `/form_modifier?routeId=${routeId}&description=${routeDescription}&theme=${selectedThemeName}`,
            { state: { token: location.state.token } }
         );
      } else {
         alert('Theme and AR Experience must be chosen.');
      }
   };

   const handleMapPage = (routeChosen) => {
      // `/form_modifier?routeId=${routeChosen}&description=${description}&theme=${selectedThemeName}`,
      navigate(`/map_builder?routeId=${routeChosen}`, {
         state: { token: location.state.token },
      });
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
                     ? { fontSize: '1rem', ml: 10, mb: 1 }
                     : { fontSize: '1.25rem' }
               }
            >
               <span>
                  <b>Choose Tour Theme:</b>
               </span>
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
               {isSmallScreen ? (
                  <Grid
                     objArray={formTheme
                        .map((theme, index) => ({
                           ...theme,
                           id: `theme_${index}`,
                        }))
                        .map((theme) => (
                           <Button
                              key={theme.themeid}
                              onClick={() =>
                                 setSelectedTheme(theme.themeid, theme.theme)
                              }
                              // onClick={() => setSelectedTheme(theme.themeid)}
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
                                         marginBottom: 1,
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
                  />
               ) : (
                  formTheme.map((theme) => (
                     <Button
                        key={theme.themeid}
                        onClick={() =>
                           setSelectedTheme(theme.themeid, theme.theme)
                        }
                        // onClick={() => setSelectedTheme(theme.themeid)}
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
                                   marginBottom: 1,
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
                  ))
               )}
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
               <span>
                  <b>Choose AR Experience:</b>
               </span>
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
                     <div className={styles.arlevel_name}>
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
                        ? {
                             fontSize: '1.05rem',
                             ml: 1,
                             mt: 4,
                             maxWidth: 'max-content',
                          }
                        : { fontSize: '1.25rem' }
                  }
               >
                  <span>
                     <b>Available Routes:</b>
                  </span>
               </Typography>
            </div>
         </Box>
         {!filteredData ? (
            <div className={styles.routes_imgs}>
               {routes.map((route) => (
                  <div
                     key={route.routeid}
                     // onClick={() => chooseRoute(route.routeid)}
                  >
                     <div
                        className={styles.route_img}
                        onClick={() =>
                           chooseRoute(route.routeid, route.description)
                        }
                     >
                        <img src={route.imgurl} alt={route.description} />
                     </div>
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
                     <div className={styles.img_icons}>
                        <div className={styles.star}>
                           <img src={Star} alt='rank' />
                           <span>{route.evaluation_grade.toFixed(1)}</span>
                        </div>
                        <div
                           className={styles.edit}
                           onClick={() =>
                              handleModifierForm(
                                 route.routeid,
                                 route.description
                              )
                           }
                        >
                           <img src={Edit} alt='edit' width='24' height='24' />
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         ) : (
            <div className={styles.routes_imgs}>
               {filteredData.map((route) => (
                  <div
                     key={route.routeid}
                     // onClick={(e) => chooseRoute(route.routeid)}
                  >
                     <div
                        className={styles.route_img}
                        onClick={(e) =>
                           chooseRoute(route.routeid, route.description)
                        }
                     >
                        <img src={route.imgurl} alt={route.description} />
                     </div>
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
                     <div className={styles.img_icons}>
                        <div className={styles.star}>
                           <img src={Star} alt='rank' />
                           <span>{route.evaluation_grade.toFixed(1)}</span>
                        </div>
                        <div
                           className={styles.edit}
                           onClick={() =>
                              handleModifierForm(
                                 route.routeid,
                                 route.description
                              )
                           }
                        >
                           <img src={Edit} alt='edit' width='24' height='24' />
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         )}
      </>
   );
};

export default Form_Consumer;
