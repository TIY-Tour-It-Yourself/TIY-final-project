import React from 'react';
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
import park from './card_images/national_park.jpg';
import { display } from '@mui/system';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
   const theme = useTheme();
   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
   const navigate = useNavigate();

   return (
      <>
         <NavBar />
         <Typography
            className={styles.title}
            sx={ !isSmallScreen ? {
               display: 'flex',
               flexDirection: 'row',
               justifyContent: 'center',
               mt: '5%',
               textAlign: 'left',
            } : {}}
         >
            <h1>What Would You Like To Do?</h1>
         </Typography>
         <Container sx={{ display: 'flex', flexWrap: 'wrap', mt: 2, justifyContent: 'space-evenly'}}>
            <Card className={styles.card} sx={{ width: 240 }}>
               <CardMedia sx={isSmallScreen ? {}: {}}
                  component="img"
                  height='100'
                  center
                  image={bursa}
                  alt="National Park"
               />
               <CardContent>
                  <div style={{display:'flex', justifyContent: 'center'}}>
                  <Typography variant='h6' component='div'>
                     Tour Suggestions
                  </Typography>
                  </div>
               </CardContent>
               <CardActions>
                  <Box sx={{ m: '0 auto'}}><Button onClick={() => navigate('/form_consumer')} size='small' style={ isSmallScreen ? { fontWeight: 'bold'} : { fontWeight: 'bold', fontSize: '1rem' }}>Enter</Button></Box>
               </CardActions>
            </Card>
            <Card className={styles.card} sx={{ width: 240 }}>
            <CardMedia sx={isSmallScreen ? {}: {}}
               component="img"
               height='100'
               center
               image={map}
               alt="National Park"
               />
               <CardContent>
               <div style={{display:'flex', justifyContent: 'center'}}>
                  <Typography variant='h6' component='div'>
                     Build Your Own Tour
                  </Typography>
               </div>
               </CardContent>
               <CardActions>
               <Box sx={{ m: '0 auto'}}><Button onClick={() => navigate('/form_producer')} size='small' style={isSmallScreen ? { fontWeight: 'bold'} : { fontWeight: 'bold', fontSize: '1rem' }} >Enter</Button></Box>
               </CardActions>
            </Card>
         </Container>
      </>
   );
};

export default Dashboard;