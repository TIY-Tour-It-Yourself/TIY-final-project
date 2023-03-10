import React from 'react';
import styles from './Dashboard.module.css';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import NavBar from '../Additionals/NavBar/NavBar';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import park from './card_images/national_park.jpg';
import { display } from '@mui/system';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const Dashboard = () => {
   const theme = useTheme();
   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

   return (
      <>
         <NavBar />
         <Typography
            className={styles.title}
            sx={{
               display: 'flex',
               flexDirection: 'row',
               justifyContent: 'center',
               mt: '5%',
               textAlign: 'left',
            }}
         >
            <h1>What Would You Like To Do?</h1>
         </Typography>
         <Container sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly'}}>
         <Card className={styles.card} sx={{ width: 240 }}>
            <CardMedia sx={{}}
            component="img"
            height='100'
            // width='200'
            image={park}
            alt="National Park"
            />
            <CardContent>
               {/* <Typography
                  sx={{ fontSize: 14 }}
                  color='purple'
                  gutterBottom
               >
                 I'm feeling adventurous
               </Typography> */}
               <Typography variant='h6' component='div'>
                  Tour Suggestions
               </Typography>
               {/* <Typography sx={{ mb: 1.5 }} color='text.secondary'>
                  adjective
               </Typography> */}
            </CardContent>
            <CardActions>
               <Button size='small'>Enter</Button>
            </CardActions>
         </Card>
         <Card className={styles.card} sx={{ width: 240 }}>
            <CardContent>
               {/* <Typography
                  sx={{ fontSize: 14 }}
                  color='text.secondary'
                  gutterBottom
               >
                  Word of the Day
               </Typography> */}
               <Typography variant='h6' component='div'>
                  Build Your Own Tour
               </Typography>
            </CardContent>
            <CardActions>
               <Button size='small'>Enter</Button>
            </CardActions>
         </Card>
         <Card className={styles.card} sx={{ width: 240 }}>
            <CardContent>
               <Typography
                  sx={{ fontSize: 14 }}
                  color='text.secondary'
                  gutterBottom
               >
                  Word of the Day
               </Typography>
               <Typography variant='h5' component='div'>
                  Tour Suggestions
               </Typography>
               <Typography sx={{ mb: 1.5 }} color='text.secondary'>
                  adjective
               </Typography>
               <Typography variant='body2'>
                  well meaning and kindly.
                  <br />
                  {'"a benevolent smile"'}
               </Typography>
            </CardContent>
            <CardActions>
               <Button size='small'>Enter</Button>
            </CardActions>
         </Card>
         </Container>
      </>
   );
};

export default Dashboard;
