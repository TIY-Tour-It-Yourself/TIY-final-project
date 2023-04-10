import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import NavBar from '../Additionals/NavBar/NavBar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import bursa from './card_images/bursa.jpg';
import map from '../Additionals/Assets/map_cropped.jpg';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useNavigate, useLocation } from 'react-router-dom';

const Dashboard = () => {
   const [token, setToken] = useState('');
   const [activeImage, setActiveImage] = useState(null);
   const theme = useTheme();
   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
   const navigate = useNavigate();
   const location = useLocation();

   useEffect(() => {
      console.log(location.state.token.token);
      console.log(location.state.token);
      if(!location.state) {
         navigate('/');
      } else {
         setActiveImage(1);
         axios
         .get(`https://tiys.herokuapp.com/api/auth`, {
            headers: {
               'x-auth-token': location.state.token.token,
               'Content-Type': 'application/json',
            },
         })
         .then((response) => {
            console.log(response.data);   //user's data
            setToken(location.state.token.token);
         })
         .catch((error) => {
            console.error('Error fetching user: ', error);
         });
      }
   }, [location.state]);
   
   console.log(token);  //location.state.token.token
   console.log(location.state.token.token);  //location.state.token.token

   const handleNavigateProducer = () => {
      navigate('/form_producer', { state: { token: {value: location.state.token } }});
   }
   
   const handleNavigateConsumer = () => {
      navigate('/form_consumer', { state: { token: token }});
   }

   return (
      <>
         <NavBar token={token} activeImage={activeImage} />
         <Typography
            component='div'
            className={styles.title}
            sx={
               !isSmallScreen
                  ? {
                       display: 'flex',
                       flexDirection: 'row',
                       justifyContent: 'center',
                       mt: '5%',
                       textAlign: 'center',
                    }
                  : { fontSize: '50px', textAlign: 'center' }
            }
         >
            <h1>What Would You Like To Do?</h1>
         </Typography>
         <Container
            sx={{
               display: 'flex',
               flexWrap: 'wrap',
               mt: 2,
               justifyContent: 'space-evenly',
            }}
         >
            <Card className={styles.card} sx={{ width: 240 }}>
               <CardMedia
                  component='img'
                  height='100'
                  image={bursa}
                  alt='National Park'
               />
               <CardContent>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                     <Typography variant='h6' component='div'>
                        Tour Suggestions
                     </Typography>
                  </div>
               </CardContent>
               <CardActions>
                  <Box sx={{ m: '0 auto' }}>
                     <Button
                        onClick={handleNavigateConsumer}
                        size='small'
                        style={
                           isSmallScreen
                              ? { fontWeight: 'bold' }
                              : { fontWeight: 'bold', fontSize: '1rem' }
                        }
                     >
                        Enter
                     </Button>
                  </Box>
               </CardActions>
            </Card>
            <Card className={styles.card} sx={{ width: 240 }}>
               <CardMedia
                  component='img'
                  height='100'
                  image={map}
                  alt='National Park'
               />
               <CardContent>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                     <Typography variant='h6' component='div'>
                        Build Your Own Tour
                     </Typography>
                  </div>
               </CardContent>
               <CardActions>
                  <Box sx={{ m: '0 auto' }}>
                     <Button
                        onClick={handleNavigateProducer}
                        size='small'
                        style={
                           isSmallScreen
                              ? { fontWeight: 'bold' }
                              : { fontWeight: 'bold', fontSize: '1rem' }
                        }
                     >
                        Enter
                     </Button>
                  </Box>
               </CardActions>
            </Card>
         </Container>
      </>
   );
};

export default Dashboard;
