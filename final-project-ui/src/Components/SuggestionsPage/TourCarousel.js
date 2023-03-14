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
         name: "Biyalik's Story",
         imageUrl: tour1,
         link: '/tour1',
         description:
         'Get to know the Life of the Famous Israeli Poet',
      },
      {
         id: 2,
         name: "Biyalik's Story",
         imageUrl: tour1,
         link: '/tour2',
         description:
         'Get to know the Life of the Famous Israeli Poet',
      },
      {
         id: 3,
         name: "Biyalik's Story",
         imageUrl: tour1,
         link: '/tour3',
         description:
         'Get to know the Life of the Famous Israeli Poet',
      },
      {
         id: 4,
         name: "Biyalik's Story",
         imageUrl: tour1,
         link: '/tour4',
         description:
         'Get to know the Life of the Famous Israeli Poet',
      },
      {
         id: 5,
         name: "Biyalik's Story",
         imageUrl: tour1,
         link: '/tour5',
         description:
         'Get to know the Life of the Famous Israeli Poet',
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
