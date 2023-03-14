import React from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import TourCard from './TourCard';
import styles from './TourCard.module.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import tour1 from './suggestions_imgs/tour1.jpg';
import { Typography } from '@mui/material';
import NavBar from '../Additionals/NavBar/NavBar';

const TourCarousel = () => {
   const tours = [
      {
         id: 1,
         name: 'בעקבות ביאליק',
         imageUrl: tour1,
         link: '/tour1',
         description:
            'בואו להכיר את חייו של המשורר הלאומי חיים נחמן ביאליק בעיר רמת גן ',
      },
      {
         id: 2,
         name: 'בעקבות ביאליק',
         imageUrl: tour1,
         link: '/tour2',
         description:
            'בואו להכיר את חייו של המשורר הלאומי חיים נחמן ביאליק בעיר רמת גן ',
      },
      {
         id: 3,
         name: 'בעקבות ביאליק',
         imageUrl: tour1,
         link: '/tour3',
         description:
            'בואו להכיר את חייו של המשורר הלאומי חיים נחמן ביאליק בעיר רמת גן ',
      },
      {
         id: 4,
         name: 'בעקבות ביאליק',
         imageUrl: tour1,
         link: '/tour4',
         description:
            'בואו להכיר את חייו של המשורר הלאומי חיים נחמן ביאליק בעיר רמת גן ',
      },
      {
         id: 5,
         name: 'בעקבות ביאליק',
         imageUrl: tour1,
         link: '/tour5',
         description:
            'בואו להכיר את חייו של המשורר הלאומי חיים נחמן ביאליק בעיר רמת גן ',
      },
   ];

   const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000,
      centerMode: true,
      centerPadding: '10px',
      responsive: [
         {
            breakpoint: 768,
            settings: {
               slidesToShow: 1,
               slidesToScroll: 1,
               centerPadding: '30px',
            },
         },
      ],
   };

   return (
      <>
         <NavBar />
         <div className={styles.Carousel_Card}>
         <Typography
            component='div'
            sx={{ display: 'flex', justifyContent: 'center' }}
         >
            <h1>Suggested For You:</h1>
         </Typography>
            <Slider {...settings}>
               {tours.map((tour) => (
                  <TourCard key={tour.id} tour={tour} />
               ))}
            </Slider>
         </div>
      </>
   );
};

export default TourCarousel;
