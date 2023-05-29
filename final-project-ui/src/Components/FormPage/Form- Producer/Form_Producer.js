import React, { useState, useEffect } from 'react';
import styles from './Form_Producer.module.css';
import axios from 'axios';
import { Button, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import NavBar from '../../Additionals/NavBar/NavBar';
import Grid from '../../Additionals/Grid/Grid';
import LoadingBar from '../../Additionals/LoadingBar/LoadingBar';
import EventsModal from '../../EventsModal/EventsModal';
import useMediaQuery from '@mui/material/useMediaQuery';
import ARFirstLevel from './ar_imgs/boy_with_mobile_level_2.jpg';
import ARSecondLevel from './ar_imgs/ar_img_1.jpg';
import ARThirdLevel from './ar_imgs/ar_level_3_elephant.png';
import Location from './routes_imgs/pin_red.png';
import Star from './pois_imgs/star_32.png';
import usePrevious from './usePrevious';

const arImgs = [
   { id: 1, name: 'Intermediate', src: ARFirstLevel },
   { id: 2, name: 'Advanced', src: ARSecondLevel },
   { id: 3, name: 'Professional', src: ARThirdLevel },
];

const Form_Producer = () => {
   const [formState, setFormState] = useState(true);
   const previousFormState = usePrevious(formState);
   const [eventModalOpen, setEventModalOpen] = useState(false);
   const [formTheme, setFormTheme] = useState('');
   const [themeName, setSelectedThemeName] = useState('');
   const [themeSelectedId, setThemeSelectedId] = useState('');
   const [selectedLevelId, setSelectedLevelId] = useState('');
   const [selectedEvents, setSelectedEvents] = useState([]);
   const [email, setEmail] = useState('');
   const [isFormValid, setIsFormValid] = useState(false);
   const [routeChosen, setRouteChosen] = useState('');
   const [routes, setRoutes] = useState('');
   const [filteredData, setFilteredData] = useState([]);
   const [isLoading, setIsLoading] = useState(false);
   const [selectedPOIs, setSelectedPOIs] = useState([]);
   // State for storing selected radius
   const [selectedRadius, setSelectedRadius] = useState(0);
   const [radius, setRadius] = useState(1); // initialize radius to 1 km
   const [userLocation, setUserLocation] = useState(null);
   const [coordinates, setCoordinates] = useState([]);

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
               setEmail(response.data.email);
            })
            .catch((error) => {
               console.error('Error fetching user: ', error);
            });
      }
   }, [location.state]);

   useEffect(() => {
      // Logic to handle closing the event modal
      if (eventModalOpen) {
         setFormState(previousFormState);
      }
   }, [eventModalOpen, previousFormState]);

   //Get Themes from DB
   useEffect(() => {
      setIsLoading(true);
      axios
         .get('https://tiys.herokuapp.com/api/themes')
         .then((response) => {
            setFormTheme(response.data);
            setIsLoading(false);
         })
         .catch((error) => {
            console.error('Error fetching Themes: ', error);
            setIsLoading(false);
         });
   }, []);

   useEffect(() => {
      if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(
            (position) => {
               const { latitude, longitude } = position.coords;
               setUserLocation({ latitude, longitude });
            },
            (error) => {
               console.error(error);
            }
         );
      } else {
         console.error('Geolocation is not supported by this browser.');
      }
   }, []);

   //Get POIS from DB
   useEffect(() => {
      setIsLoading(true);
      const filterData = async () => {
         try {
            // Make an API request to fetch the POIs data
            const response = await axios.get(
               'https://tiys.herokuapp.com/api/pois'
            );
            // console.log(response.data);
            setIsLoading(false);
            setCoordinates(response.data);
         } catch (error) {
            console.log(error);
            setIsLoading(false);
         }
      };
      filterData();
   }, []);

   //Display filtered POIs
   useEffect(() => {
      let newLevelId = 0;
      if (themeSelectedId && selectedLevelId) {
         if (selectedLevelId === 1 || selectedLevelId === 3) {
            newLevelId = 2;
         } else {
            newLevelId = selectedLevelId;
         }
         let filtered = coordinates.filter((coordinate) => {
            return (
               coordinate.theme.themeid === themeSelectedId &&
               coordinate.arid.level === newLevelId
            );
         });
         setFilteredData(filtered);
      } else {
         setFilteredData(null);
      }
   }, [themeSelectedId, selectedLevelId, coordinates]);

   useEffect(() => {
      if (
         themeSelectedId &&
         selectedLevelId &&
         selectedRadius &&
         userLocation
      ) {
         const filtered = coordinates.filter((coordinate) => {
            // Calculate the distance between user and POI using Haversine formula
            const distance = calcDistance(
               userLocation.latitude,
               userLocation.longitude,
               coordinate.coordinates.lat,
               coordinate.coordinates.lng
            );
            return (
               distance <= selectedRadius * 1000 &&
               coordinate.theme.themeid === themeSelectedId &&
               coordinate.arid.level === selectedLevelId
            );
         });
         setFilteredData(filtered);
      }
   }, [
      themeSelectedId,
      selectedLevelId,
      selectedRadius,
      userLocation,
      coordinates,
   ]);

   //Handle Events
   const handleEventSelection = (selectedEvents) => {
      setSelectedEvents(selectedEvents);
   };

   //Open Events Modal
   const handleOpenModal = () => {
      setEventModalOpen(true);
   };

   // Function to calculate the distance between two points using Haversine formula
   const calcDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371 * 1000; // Radius of the earth in km
      const dLat = deg2rad(lat2 - lat1);
      const dLon = deg2rad(lon2 - lon1);
      const a =
         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
         Math.cos(deg2rad(lat1)) *
            Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = R * c; // Distance in km
      return d;
   };

   const deg2rad = (deg) => {
      return deg * (Math.PI / 180);
   };

   const handleRadiusChange = (event) => {
      const value = Number(event.target.value);
      setSelectedRadius(value);
      setRadius(value);
   };

   //While data hasn't become an array yet- keep loading
   if (!Array.isArray(formTheme) || !Array.isArray(coordinates)) {
      return <LoadingBar />;
   }

   const setSelectedTheme = (value) => {
      if (themeSelectedId !== '') {
         setThemeSelectedId(value);
      } else {
         setThemeSelectedId(value);
      }
   };

   const handleARExperience = (arId) => {
      setSelectedLevelId(arId);
   };

   //Update array according to filter and selection
   const handlePOISelection = (poi) => {
      if (themeSelectedId && selectedLevelId) {
         // Check if POI is already selected
         const poiIndex = selectedPOIs.indexOf(poi);
         if (poiIndex === -1) {
            // POI not already selected - add to array
            setSelectedPOIs([...selectedPOIs, poi]);
         } else {
            // POI already selected - remove from array
            const updatedPOIs = [...selectedPOIs];
            updatedPOIs.splice(poiIndex, 1);
            setSelectedPOIs(updatedPOIs);
            setIsFormValid(true);
         }
      } else {
         alert('Theme and AR Experience must be chosen.');
         setIsFormValid(false);
      }
   };

   const poiid = selectedPOIs ? selectedPOIs.map((item) => item.poiid) : [];

   // Convert poiid array to an object with numbered keys
   const poiidMap = poiid.reduce((accumulator, current, i) => {
      accumulator[`poi${i + 1}`] = current;
      return accumulator;
   }, {});

   const handleNavigate = async () => {
      try {
         const getNewRouteIdRes = await axios.get(
            'https://tiys.herokuapp.com/api/routes/getnewid/'
         );
         // console.log(themeName);
         const userRouteData = await axios
            .post('https://tiys.herokuapp.com/api/routes', {
               routeid: getNewRouteIdRes.data,
               description: 'Private Route',
               pois: poiid,
               evaluation_grade: 0,
               experience_level: selectedLevelId,
               theme: themeName,
               imgurl: '',
               access: 'private',
               email: email,
            })
            .then((response) => {
               // console.log(response.data.token);
               return response.data.token;
            })
            .catch((error) => {
               console.log(error);
               throw error;
            });

         navigate(
            `/map_builder?routeId=${
               getNewRouteIdRes.data
            }&ARLevel=${selectedLevelId}&selectedEvents=${JSON.stringify(
               selectedEvents
            )}`,
            {
               state: { token: location.state.token },
            }
         );
      } catch (error) {
         console.log(error);
      }
   };

   return (
      <>
         <NavBar />
         <Typography component='div' className={styles.title}>
            <h1 style={!isSmallScreen ? {} : { fontSize: '25px' }}>
               Build Your Tour
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
                  <b> Choose Tour Theme: </b>
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
                          marginBottom: '25px',
                       }
               }
            >
               {isSmallScreen ? (
                  <Grid
                     objArray={formTheme.map((theme) => (
                        <Button
                           key={theme.themeid}
                           onClick={() => {
                              setSelectedTheme(theme.themeid);
                              setSelectedThemeName(theme.theme);
                           }}
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
                  />
               ) : (
                  formTheme.map((theme) => (
                     <Button
                        key={theme.themeid}
                        onClick={() => {
                           setSelectedTheme(theme.themeid);
                           setSelectedThemeName(theme.theme);
                        }}
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
                  ))
               )}
            </Box>
         </Box>
         <div className={styles.components}>
            <div className={styles.ar_div}>
               <Typography
                  component='span'
                  sx={
                     isSmallScreen
                        ? { fontSize: '1rem', ml: 2, mt: 2, mb: 1 }
                        : { fontSize: '1.25rem', mt: 2 }
                  }
               >
                  <b>Choose AR Experience: </b>
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
                           <span> {arImg.name} </span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
            <Box component='div' className={styles.radius_filter}>
               <Typography
                  component='span'
                  sx={
                     isSmallScreen
                        ? {
                             fontSize: '1rem',
                             ml: 0,
                             mt: 2,
                             mb: 1,
                             textAlign: 'center',
                             margin: '0 auto',
                          }
                        : { fontSize: '1.25rem', mt: 2 }
                  }
               >
                  <b>Choose Distance: {selectedRadius}km</b>
               </Typography>
               {/* Add a range input to display a ruler with values from 1km to 8km */}
               <div
                  style={{
                     marginTop: '1rem',
                     display: 'flex',
                     alignItems: 'center',
                  }}
               >
                  <div
                     style={{
                        width: 'max-content',
                        textAlign: 'right',
                        marginRight: '0.5rem',
                     }}
                  >
                     1km
                  </div>
                  <input
                     type='range'
                     min='1'
                     max='8'
                     step='1'
                     style={{ width: '20rem', marginRight: '0.5rem' }}
                     value={selectedRadius}
                     onChange={handleRadiusChange}
                  />
                  <div style={{ width: '5rem', textAlign: 'left' }}>8km</div>
               </div>
               <div className={styles.events_div}>
                  <Typography
                     component='span'
                     sx={
                        isSmallScreen
                           ? { fontSize: '1.05rem', mb: 1 }
                           : { fontSize: '1.25rem' }
                     }
                  >
                     <b>Add Events:</b>
                  </Typography>
               </div>
               <Button
                  variant='contained'
                  sx={{
                     ':hover': {
                        bgcolor: '#EBB02D',
                        color: 'white',
                     },
                     mt: 1,
                     mb: 2,
                     color: 'white',
                     backgroundColor: '#EBB02D',
                     borderRadius: '20px',
                  }}
                  onClick={handleOpenModal}
               >
                  Events List
               </Button>
               {eventModalOpen && (
                  <EventsModal
                     handleCloseModal={() => setEventModalOpen(false)}
                     handleEventSelection={handleEventSelection}
                  />
               )}
            </Box>
         </div>
         {/* POIs List */}
         <div className={styles.pois_title}>
            <Typography
               component='div'
               sx={
                  isSmallScreen
                     ? {
                          fontSize: '1rem',
                          mb: 1,
                          maxWidth: '90%',
                          textAlign: 'center',
                       }
                     : { fontSize: '1.25rem' }
               }
            >
               <span>
                  <b>
                     Choose the POIs you want to visit
                     <br /> (at least 3):
                  </b>
               </span>
            </Typography>
         </div>
         {selectedPOIs.length >= 3 && (
            <div
               style={{
                  textAlign: 'center',
                  marginTop: '5px',
                  marginRight: '6px',
               }}
            >
               <Button
                  sx={
                     !isSmallScreen
                        ? {
                             width: '120px',
                             borderRadius: '20px',
                             height: '30px',
                             marginLeft: 1,
                             marginTop: 2,
                             background: '#C9EEFF',
                             fontSize: '0.75rem',
                          }
                        : {
                             marginLeft: 1.5,
                             marginBottom: 1,
                             height: '30px',
                             borderRadius: '20px',
                             background: '#C9EEFF',
                             fontSize: '0.75rem',
                          }
                  }
                  onClick={handleNavigate}
               >
                  Build Tour
               </Button>
            </div>
         )}
         {!filteredData ? (
            <div className={styles.poi_imgs}>
               {coordinates.map((poi) => (
                  <div
                     style={{ cursor: 'pointer', position: 'relative' }}
                     key={poi.poiid}
                     value={JSON.stringify(poi.coordinates)}
                     onClick={() => handlePOISelection(poi)}
                  >
                     <div className={styles.star}>
                        <img src={Star} alt='rank' />
                        <span>{poi.grade.toFixed(1)}</span>
                     </div>
                     <img src={Location} alt={poi.name} />
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
                        {poi.name}
                     </Typography>
                  </div>
               ))}
            </div>
         ) : (
            <div className={styles.poi_imgs}>
               {filteredData.map((poi) => {
                  const isSelected = selectedPOIs.includes(poi);
                  return (
                     <div
                        className={isSelected ? styles.border : ''}
                        style={{ cursor: 'pointer', position: 'relative' }}
                        key={poi.poiid}
                        value={JSON.stringify(poi.coordinates)}
                        onClick={() => handlePOISelection(poi)}
                     >
                        <div className={styles.star}>
                           <img src={Star} alt='rank' />
                           <span>{poi.grade.toFixed(1)}</span>
                        </div>
                        <img src={Location} alt={poi.name} />
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
                           {poi.name}
                        </Typography>
                     </div>
                  );
               })}
            </div>
         )}
      </>
   );
};

export default Form_Producer;
