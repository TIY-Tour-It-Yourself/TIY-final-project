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

// const themes = [
//    { id: 1, name: 'Sport' },
//    { id: 2, name: 'Music' },
//    { id: 3, name: 'Culture' },
//    { id: 4, name: 'Culinary' },
//    { id: 5, name: 'History' },
//    { id: 6, name: 'Education' },
// ];

// const routes = [
//    {
//       routeid: 1,
//       image: Bialik,
//       description: 'Historical places in Ramat Gan',
//       pois: [1, 2, 3, 4],
//       evaluation_grade: '0',
//       experience_level: '2',
//       themeid: '5',
//       url: '',
//    },
//    {
//       routeid: 2,
//       image: Bialik,
//       description: 'Culinary experiences in Ramat Gan',
//       pois: [1, 2, 3, 4],
//       evaluation_grade: '5',
//       experience_level: '1',
//       themeid: '3',
//       url: '',
//    },
// ];

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

   useEffect(() => {
      //Get Themes from DB
      axios
         .get('https://tiys.herokuapp.com/api/themes')
         .then((response) => {
            setFormTheme(response.data);
         })
         .catch((err) => {
            console.log(err);
         });

      //Get Routes from DB
      // axios
      //    .get('https://tiys.herokuapp.com/api/routes')
      //    .then((response) => {
      //       setRoutes(response.data);
      //    })
      //    .catch((err) => {
      //       console.log(err);
      //    });

         // //Filtered routes according to Theme & AR Experience
         // const filtered = themeSelectedId && selectedLevelId ? 
         // routes.filter((route) => {
         //    return route.themeid === themeSelectedId && route.experience_level === selectedLevelId;
         // }) : routes;
         
         // setFil/teredData(filtered);

   }, []);

   useEffect(() => {
      const filterData = async () => {
        try {
          // Make an API request to fetch the routes data
         axios
          .get('https://tiys.herokuapp.com/api/routes')
          .then((response) => {
             setRoutes(response.data);
          })
          .catch((err) => {
             console.log(err);
          });
    
          // Filter the data based on the selected values
          const filtered = routes.filter(route => {
            return route.themeid === themeSelectedId && route.experience_level === selectedLevelId;
          });
    
          // Update the state with the filtered data
          setFilteredData(filtered);
        } catch (error) {
          console.log(error);
        }
      };
    
      filterData();
    }, [themeSelectedId, selectedLevelId]);


   console.log(`filtered: ${filteredData.length}`);
   //While data hasn't become an array yet- keep loading
   if (!Array.isArray(formTheme) || !Array.isArray(routes)) {
      return <div>Loading...</div>;
   }

   // let filtered1; //NEED TO CHECK WHY NOT WORKING

   //Filtered routes according to Theme & AR Experience
   //    const filtered = themeSelectedId && selectedLevelId ? 
   //       routes.filter((route) => {
   //       return route.themeid === themeSelectedId && route.experience_level === selectedLevelId;
   //    }) : routes;
   //    setFilteredData(filtered);
   
   // console.log(`filtered: ${filteredData.length}`);

     //Redirect to chosen route on the map
     const chooseRoute = (routeid) => {
      if (selectedLevelId && themeSelectedId) {
         // console.log(`line 122: ${selectedLevelId}, ${themeSelectedId}`);
         // console.log(routeid);
         setRouteChosen(routeid);
         setIsFormValid(true);

         //Navigate to interactive map
         // navigate('/bialik');
      } else {
         setIsFormValid(false);
      }
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
                        themeSelectedId === theme.themeid ? 'contained' : 'outlined'
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
         {filteredData.length == 0 ? (
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
                              : { fontSize: '0.8rem', 
                                 fontStyle: 'italic' }
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
