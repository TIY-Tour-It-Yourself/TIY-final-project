import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { createTheme, useTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import NavBar from '../../Additionals/NavBar/NavBar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const colors = [
   '#9BABB8',
   '#E893CF',
   '#30A2FF',
   '#D7C0AE',
   '#F2D8D8',
   '#8696FE',
   '#000000',
];
const ThemeCustomization = () => {
   // const ThemeCustomization = ({ colors }) => {
   const [appTheme, setAppTheme] = useState('#FFFFFF');
   const [fontColor, setFontColor] = useState('#000000');
   const [activeLink, setActiveLink] = useState(null);
   const [activeImage, setActiveImage] = useState(null);
   const theme = useTheme();
   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
   const location = useLocation();
   const navigate = useNavigate();

   useEffect(() => {
      // console.log(`token: ${location.state.token}`);
      // if (shouldLog.current) {
      //    shouldLog.current = false;
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
               // console.log(response.data);
            })
            .catch((error) => {
               console.error('Error fetching user: ', error);
            });
      }
      // }
   }, [location.state]);

   useEffect(() => {
      document.body.style.backgroundColor = appTheme;
   }, [appTheme]);

   const handleButtonClick = (color) => {
      //Set new background color
      if (color === 'white' || '#FFFFFF') {
         setFontColor('#3a517b');
      } else {
         setFontColor('#FFFFFF');
      }

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
            <h2
               style={{
                  marginTop: '10px',
               }}
            >
               Customize Your App:
            </h2>
         </Typography>
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
            Select in which color you would like the app to be displayed:
         </h3>
         <div
            style={{
               display: 'flex',
               flexWrap: 'wrap',
               margin: '0 auto',
               justifyContent: 'center',
            }}
         >
            {colors.map((color, index) => (
               <Button
                  key={index}
                  variant='contained'
                  style={{
                     backgroundColor: color,
                     marginRight: '10px',
                     color: fontColor,
                  }}
                  onClick={() => handleButtonClick(color)}
               >
                  {color}
               </Button>
            ))}
         </div>
      </>
   );
};

export default ThemeCustomization;
