import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import Typography from '@mui/material/Typography';
import NavBar from '../Additionals/NavBar/NavBar';
import Container from '@mui/material/Container';
import consumer from './card_images/consumer.jpg';
import producer from './card_images/producer.jpg';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingBar from '../Additionals/LoadingBar/LoadingBar';

const cards = [
   { id: 1, title: 'Choose Your Tour', src: consumer, url: '/form_consumer' },
   { id: 2, title: 'Build Your Tour', src: producer, url: '/form_producer' },
];

const Dashboard = () => {
   const [activeImage, setActiveImage] = useState(null);
   const theme = useTheme();
   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
   const navigate = useNavigate();
   const location = useLocation();

   useEffect(() => {
      if (!location.state) {
         navigate('/');
      } else {
         setActiveImage(1);
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

   const handleNavigation = (title) => {
      if (title === 'Choose Your Tour')
         navigate('/form_consumer', { state: { token: location.state.token } });
      if (title === 'Build Your Tour')
         navigate('/form_producer', { state: { token: location.state.token } });
      if (title === 'Tours History')
         navigate('/tours_history', { state: { token: location.state.token } });
   };

   return (
      <>
         <NavBar activeImage={activeImage} />
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
                  : { fontSize: '12px', mt: '2%', textAlign: 'center' }
            }
         >
            <h1>What Would You Like To Do?</h1>
         </Typography>
         <Typography
            component='div'
            sx={{
               textAlign: 'center',
            }}
         >
            <h3
               style={
                  ({ marginTop: '-10px', fontSize: '1.05rem' },
                  isSmallScreen
                     ? { fontSize: '0.95rem', marginTop: '-1px' }
                     : { marginTop: '0' })
               }
            >
               Choose a Pre-built Tour or Build One Yourself!
            </h3>
         </Typography>
         <Container
            sx={{
               marginTop: '80px',
               display: 'flex',
               flexWrap: 'wrap',
               mt: 0,
               mb: 8,
               justifyContent: 'space-evenly',
            }}
         >
            {cards.map((card) => (
               <div key={card.id}>
                  <p className={styles.box_title}>{card.title}</p>
                  <div className={styles.card}>
                     <a onClick={() => handleNavigation(card.title)}>
                        <img
                           style={{ cursor: 'pointer', borderRadius: '25px' }}
                           src={card.src}
                        />
                     </a>
                  </div>
               </div>
            ))}
         </Container>
      </>
   );
};

export default Dashboard;
