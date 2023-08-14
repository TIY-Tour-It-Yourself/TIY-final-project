import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import NavBar from '../../Additionals/NavBar/NavBar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import LoadingBar from '../../Additionals/LoadingBar/LoadingBar';
import styles from './ThemeCustomization.module.css';

const ThemeCustomization = ({ flag }) => {
   const [isLoading, setIsLoading] = useState(true);
   const [selectedColor, setSelectedColor] = useState(null);
   const [appTheme, setAppTheme] = useState('');
   const [fontColor, setFontColor] = useState('#00337C');
   const [colors, setColors] = useState([]);
   const [lockedColors, setLockedColors] = useState([]);
   const [coins, setCoins] = useState(0);
   const [email, setEmail] = useState('');
   const [name, setName] = useState('');
   const [fname, setFname] = useState('');
   const [activeLink, setActiveLink] = useState(null);
   const [activeImage, setActiveImage] = useState(null);
   const [open, setOpen] = useState(false);
   const theme = useTheme();
   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
   const location = useLocation();
   const navigate = useNavigate();

   useEffect(() => {
      if (!location.state) {
         navigate('/');
      } else {
         setActiveImage(4);
         setActiveLink(3);
         axios
            .get(`https://tiys.herokuapp.com/api/auth`, {
               headers: {
                  'x-auth-token': location.state.token,
                  'Content-Type': 'application/json',
               },
            })
            .then((response) => {
               setIsLoading(false);
               setCoins(response.data.coins);
               setName(response.data.fname);
               setEmail(response.data.email);
            })
            .catch((error) => {
               setIsLoading(false);
               console.error('Error fetching user: ', error);
            });
      }
   }, [location.state]);

   //Display this page with the previously chosen color by user
   useEffect(() => {
      const storedTheme = localStorage.getItem('appTheme');
      if (storedTheme) {
         setAppTheme(storedTheme);
         document.body.style.backgroundColor = storedTheme;
      } else {
         const defaultTheme = 'white'; // Set a default theme color
         setAppTheme(defaultTheme);
         document.body.style.backgroundColor = defaultTheme;
         localStorage.setItem('appTheme', defaultTheme);
      }
   }, []);

   useEffect(() => {
      if (email) {
         const fetchColors = async () => {
            try {
               const response = await axios.get(
                  `https://tiys.herokuapp.com/api/skins/${email}`
               );
               setColors(response.data);
               const locked = Object.entries(response.data)
                  .filter(([key, value]) => value.status === 'Locked')
                  .map(([key, value]) => value);

               setLockedColors(locked);
            } catch (error) {
               console.log(error);
            }
         };
         fetchColors();
      }
   }, [email]);

   useEffect(() => {
      document.body.style.backgroundColor = appTheme;
   }, [appTheme]);

   useEffect(() => {
      const fname = name.substring(0, name.indexOf(' '));
      setFname(fname);
   }, [coins, name]);

   //Modal Style
   const style = {
      position: 'absolute',
      top: '50vh',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: isSmallScreen ? '70%' : '40%', // Adjust the width based on the screen size
      height: '75%',
      borderRadius: '30px',
      bgcolor: 'background.paper',
      border: '1px solid grey',
      overflow: 'scroll',
      boxShadow: 24,
      p: 4,
   };

   const changeTheme = (newTheme) => {
      setAppTheme(newTheme);
      document.body.style.backgroundColor = newTheme;
      localStorage.setItem('appTheme', newTheme);
   };

   const handleButtonClick = (name, code) => {
      if (code && coins >= 50) {
         changeTheme(code);
         const unlockColors = async () => {
            try {
               const response = await axios.put(
                  'https://tiys.herokuapp.com/api/skins',
                  {
                     email: email,
                     color: name,
                  }
               );
               console.log(response.data);
            } catch (error) {
               console.log(error);
            }
         };
         unlockColors();

         // Update the status of all colors
         const updatedLockedColors = lockedColors.map((color) => {
            return {
               ...color,
               status: color.code === code ? 'Unlocked' : 'Locked',
            };
         });

         setLockedColors(updatedLockedColors);
         setSelectedColor(code);
         setAppTheme(code);
      } else {
         //If coins < 50
         alert("Sorry! You Don't Have Enough Coins.");
      }
   };

   const handleUnlockedColor = (code) => {
      if (code) {
         changeTheme(code);
         // Update the status of the unlocked color
         const updatedColors = Object.values(colors).map((color) => {
            if (color.code === code) {
               return {
                  ...color,
                  status: 'Unlocked',
               };
            }
            return color;
         });
         setColors(updatedColors);
         setSelectedColor(code);
         setAppTheme(code);
      }
   };

   const appBarStyle = {
      backgroundColor: appTheme,
   };

   const handleOpenModal = () => {
      setOpen(true);
   };

   const handleCloseModal = () => {
      setOpen(false);
   };

   //Return Colors Array
   return (
      <>
         {isLoading ? (
            <LoadingBar />
         ) : (
            <>
               <NavBar
                  activeImage={activeImage}
                  activeLink={activeLink}
                  style={appBarStyle}
               />
               <Typography
                  component='div'
                  sx={
                     isSmallScreen
                        ? {
                             marginTop: '40px',
                          }
                        : { marginTop: '100px', fontSize: '1.25rem' }
                  }
               >
                  <h2 className={styles.CustomizeTitle}>Customize Your App</h2>
               </Typography>
               <Typography
                  component='div'
                  sx={{
                     width: 'max-content',
                     margin: '0 auto',
                     ...(isSmallScreen ? { width: '80%' } : {}),
                  }}
               >
                  <h3
                     style={
                        isSmallScreen
                           ? {
                                textAlign: 'center',
                                fontSize: '0.9rem',
                             }
                           : {
                                textAlign: 'center',
                                marginTop: '10px',
                             }
                     }
                  >
                     Select in which color you would like the app to be
                     displayed
                  </h3>
               </Typography>
               <Box
                  sx={{
                     display: 'flex',
                     flexWrap: 'wrap',
                     margin: '0 auto',
                     justifyContent: 'center',
                     width: '80%',
                  }}
               >
                  {/* Render the unlocked colors from the original array */}
                  {Object.values(colors).map((color, index) => {
                     if (color.status === 'Unlocked') {
                        return (
                           <Button
                              key={index}
                              variant='contained'
                              style={{
                                 backgroundColor: color.code,
                                 marginRight: '10px',
                                 color:
                                    selectedColor === color.code
                                       ? fontColor
                                       : '#00337C',
                                 border:
                                    selectedColor === color.code
                                       ? '1px solid grey'
                                       : 'none',
                                 ...(isSmallScreen
                                    ? { margin: '2%', width: '40%' }
                                    : {}),
                              }}
                              onClick={() => handleUnlockedColor(color.code)}
                           >
                              {color.name}
                           </Button>
                        );
                     }
                     return null;
                  })}
                  {lockedColors.map((color, index) => (
                     <Button
                        key={index}
                        variant='contained'
                        style={{
                           backgroundColor: color.code,
                           marginRight: '10px',
                           color:
                              selectedColor === color.code
                                 ? fontColor
                                 : '#00337C',
                           border:
                              selectedColor === color.code
                                 ? '1px solid grey'
                                 : 'none',
                           ...(isSmallScreen
                              ? { margin: '2%', width: '40%' }
                              : {}),
                           ...(color.status === 'Locked'
                              ? { backgroundColor: '#F0F0F0', color: '#7F8487' }
                              : {}),
                        }}
                        onClick={() =>
                           handleButtonClick(color.name, color.code)
                        }
                        disabled={color.status === 'Locked'}
                     >
                        {color.name}
                     </Button>
                  ))}
               </Box>
               <Box
                  component='div'
                  sx={{
                     display: 'flex',
                     justifyContent: 'center',
                     flexDirection: 'column',
                     marginTop: '30px',
                     textAlign: 'center',
                  }}
               >
                  <h3 style={{ fontSize: '1.25rem' }}>
                     {fname}'s Coins: {coins}
                  </h3>
               </Box>
               <Box
                  sx={{
                     display: 'flex',
                     justifyContent: 'center',
                  }}
               >
                  <Button
                     variant='outlined'
                     sx={
                        ({
                           marginLeft: '10px',
                        },
                        isSmallScreen
                           ? {
                                fontSize: '0.85rem',
                             }
                           : {})
                     }
                     onClick={handleOpenModal}
                  >
                     Unlock Color
                  </Button>
                  <Modal
                     open={open}
                     onClose={handleCloseModal}
                     aria-labelledby='modal-modal-title'
                     aria-describedby='modal-modal-description'
                  >
                     <Box component='div' sx={style}>
                        <div
                           style={{
                              textAlign: 'center',
                           }}
                        >
                           <h3>Select Which Color To Unlock</h3>
                           <div
                              style={
                                 !isSmallScreen
                                    ? {
                                         width: '100%',
                                         margin: '0 auto',
                                      }
                                    : {}
                              }
                           >
                              {lockedColors.map((color, index) => (
                                 <Button
                                    component='div'
                                    key={index}
                                    variant='contained'
                                    style={{
                                       backgroundColor: color.code,
                                       marginRight: '10px',
                                       color:
                                          selectedColor === color.code
                                             ? fontColor
                                             : '#00337C',
                                       border:
                                          selectedColor === color.code
                                             ? '1px solid grey'
                                             : 'none',
                                       ...(isSmallScreen
                                          ? { margin: '2%', width: '40%' }
                                          : { margin: '1%', width: '20%' }),
                                    }}
                                    onClick={() =>
                                       handleButtonClick(color.name, color.code)
                                    }
                                    disabled={
                                       !lockedColors.find(
                                          (lockedColor) =>
                                             lockedColor.code === color.code
                                       )
                                    }
                                 >
                                    {color.name}
                                 </Button>
                              ))}
                           </div>
                           <br />
                           <br />
                           <Button
                              variant='outlined'
                              className={styles.button}
                              sx={{ fontWeight: 'bold' }}
                              onClick={handleCloseModal}
                           >
                              Close
                           </Button>
                        </div>
                     </Box>
                  </Modal>
               </Box>
            </>
         )}
      </>
   );
};

export default ThemeCustomization;
