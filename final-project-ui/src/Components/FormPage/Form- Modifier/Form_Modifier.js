import React, { useState, useEffect, useMemo } from 'react';
import styles from './Form_Modifier.module.css';
import axios from 'axios';
import { Button, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import Grid from '../../Additionals/Grid/Grid';
import NavBar from '../../Additionals/NavBar/NavBar';
import LoadingBar from '../../Additionals/LoadingBar/LoadingBar';
import useMediaQuery from '@mui/material/useMediaQuery';
import ARFirstLevel from './ar_imgs/boy_with_mobile_level_2.jpg';
import Location from './pois_imgs/pin_red.png';
import ARSecondLevel from './ar_imgs/ar_img_1.jpg';
import ARThirdLevel from './ar_imgs/ar_level_3_elephant.png';
import Star from './pois_imgs/star_32.png';

const arImgs = [
   { id: 1, name: 'Intermediate', src: ARFirstLevel },
   { id: 2, name: 'Advanced', src: ARSecondLevel },
   { id: 3, name: 'Professional', src: ARThirdLevel },
];

const Form_Modifier = () => {
   const [selectedLevelId, setSelectedLevelId] = useState('');
   const [filteredData, setFilteredData] = useState([]);
   const [isFormValid, setIsFormValid] = useState(false);
   const [routeId, setRouteId] = useState('');
   const [poisData, setPoisData] = useState([]);
   const [email, setEmail] = useState('');
   const [filteredPois, setFilteredPois] = useState([]);
   const [selectedPOIs, setSelectedPOIs] = useState([]);
   const [selectedTheme, setSelectedTheme] = useState('');
   const [routeName, setRouteName] = useState('');
   const [isLoading, setIsLoading] = useState(true);

   const theme = useTheme();
   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
   const navigate = useNavigate();
   const location = useLocation();
   let routeDescription;

   useEffect(() => {
      //display current page at the top
      window.scrollTo(0, 0);
      const searchParams = new URLSearchParams(location.search);
      const routeChosen = searchParams.get('routeId');
      const routeTheme = searchParams.get('theme');
      routeDescription = searchParams.get('description');

      setRouteId(routeChosen);
      setSelectedTheme(routeTheme);
      setRouteName(routeDescription);

      //Get Route data from DB
      const fetchData = async () => {
         try {
            const response = await axios.get(
               `https://tiys.herokuapp.com/api/routes/${routeChosen}`
            );
            // console.log(response.data);
            setSelectedLevelId(response.data[0].experience_level);
         } catch (error) {
            console.error(error);
         }
      };
      fetchData();
   }, [location]);

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
               setEmail(response.data.email);
               // console.log(response.data);
            })
            .catch((error) => {
               console.error('Error fetching user: ', error);
            });
      }
   }, [location.state]);

   //Get POIS from DB
   useEffect(() => {
      const fetchData = async () => {
         try {
            // Make an API request to fetch the POIs data
            const response = await axios.get(
               'https://tiys.herokuapp.com/api/pois'
            );
            // console.log(response.data);
            //Not Filtered
            setPoisData(response.data);
         } catch (error) {
            console.log(error);
         }
      };
      fetchData();
   }, []);

   //Display filtered POIs
   useEffect(() => {
      let newLevelId = 0;
      const filterData = poisData.filter((poi) => {
         return poi.theme.theme === selectedTheme;
      });
      setFilteredPois(filterData);

      if (selectedLevelId) {
         if (selectedLevelId === 1 || selectedLevelId === 3) {
            newLevelId = 2;
         } else {
            newLevelId = selectedLevelId;
         }
      }
   }, [selectedTheme, selectedLevelId, poisData]);

   //While data hasn't become an array yet- keep loading
   if (!Array.isArray(poisData) || !Array.isArray(filteredPois)) {
      return <LoadingBar />;
   }

   const handleARExperience = (arId) => {
      setSelectedLevelId(arId);
   };

   //Update array according to filter and selection
   const handlePOISelection = (poi) => {
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
   };

   const poiid = selectedPOIs ? selectedPOIs.map((item) => item.poiid) : [];

   const handleNavigate = async () => {
      try {
         const getNewRouteIdRes = await axios.get(
            'https://tiys.herokuapp.com/api/routes/getnewid/'
         );
         const userRouteData = await axios
            .post('https://tiys.herokuapp.com/api/routes', {
               routeid: getNewRouteIdRes.data,
               // description: 'Private Route',
               description: routeName,
               pois: poiid,
               evaluation_grade: 0,
               experience_level: selectedLevelId,
               theme: selectedTheme,
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
            `/map_builder?routeId=${getNewRouteIdRes.data}&ARLevel=${selectedLevelId}`,
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
            <h1
               style={
                  !isSmallScreen
                     ? { fontSize: '1.75rem' }
                     : { fontSize: '1.25rem' }
               }
            >
               Modify Tour:{' '}
               <span style={{ color: '#19A7CE' }}>{routeName}</span>
            </h1>
         </Typography>
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
         {!filteredPois ? (
            <div className={styles.poi_imgs}>
               {poisData.map((poi) => (
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
               {filteredPois.map((poi) => {
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

export default Form_Modifier;
