import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import NavBar from '../../Additionals/NavBar/NavBar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LoadingBar from '../../Additionals/LoadingBar/LoadingBar';

const colors = [
   { name: 'Gray', color: '#DDDDDD' },
   { name: 'Orange', color: '#FFA559' },
   { name: 'Yellow', color: '#F6FA70' },
   { name: 'Blue', color: '#AEE2FF' },
   { name: 'Pink', color: '#FFE1E1' },
   { name: 'Purple', color: '#E5D1FA' },
   { name: 'Green', color: '#ADE792' },
   { name: 'White', color: '#FFFFFF' },
];
const ThemeCustomization = ({ flag }) => {
   const [isLoading, setIsLoading] = useState(true);
   const [selectedColor, setSelectedColor] = useState(null);
   const [appTheme, setAppTheme] = useState('#FFFFFF');
   const [fontColor, setFontColor] = useState('#00337C');
   const [coins, setCoins] = useState(0);
   const [name, setName] = useState('');
   const [fname, setFname] = useState('');
   const [activeLink, setActiveLink] = useState(null);
   const [activeImage, setActiveImage] = useState(null);
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
            })
            .catch((error) => {
               setIsLoading(false);
               console.error('Error fetching user: ', error);
            });
      }
   }, [location.state]);

   useEffect(() => {
      document.body.style.backgroundColor = appTheme;
      document.body.style.color = fontColor;
   }, [appTheme, fontColor]);

   useEffect(() => {
      if (coins !== 0) {
         const fname = name.substring(0, name.indexOf(' '));
         setFname(fname);
      }
   }, [coins, name]);

   const handleButtonClick = (color) => {
      setSelectedColor(color);
      setAppTheme(color);

      // Change body color inside index.css
      // Change background color inside Navbar
   };

   const appBarStyle = {
      backgroundColor: appTheme,
   };

   //Return Randomly Generated Colors Array
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
                  linksColor={fontColor}
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
                  <h2
                     style={{
                        marginTop: '10px',
                     }}
                  >
                     Customize Your App
                  </h2>
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
                     displayed:
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
                  {colors.map((color, index) => (
                     <Button
                        key={index}
                        variant='contained'
                        style={{
                           backgroundColor: color.color,
                           marginRight: '10px',
                           color:
                              selectedColor === color.color
                                 ? fontColor
                                 : '#00337C',
                           border:
                              selectedColor === color.color
                                 ? '1px solid grey'
                                 : 'none',
                           ...(isSmallScreen
                              ? { margin: '2%', width: '40%' }
                              : {}),
                        }}
                        onClick={() => handleButtonClick(color.color)}
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
                     marginTop: '30px',
                     width: '50%',
                     ...(isSmallScreen
                        ? { marginLeft: '90px' }
                        : {
                             marginLeft: '380px',
                          }),
                  }}
               >
                  <h3 style={{ fontSize: '1.25rem' }}>
                     {fname}'s Coins: {coins}
                  </h3>
               </Box>
            </>
         )}
      </>
   );
};

export default ThemeCustomization;
