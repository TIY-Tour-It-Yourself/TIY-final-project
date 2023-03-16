import React from 'react';
import tour1 from './suggestions_imgs/tour1.jpg';
import styles from './TourCard.module.css';
import { Link } from 'react-router-dom';
import NavBar from '../Additionals/NavBar/NavBar';

export const TourPage = ({ tourId }) => {
   const tours = [
      {
         id: 1,
         name: "Haim Nachman Biyalik's Story",
         imageUrl: tour1,
         description:
           'Get to know the Life of the Famous Israeli Poet',
      },
      {
         id: 2,
         name: "Haim Nachman Biyalik's Story",
         imageUrl: tour1,
         description:
         'Get to know the Life of the Famous Israeli Poet',
      },
      {
         id: 3,
         name: "Haim Nachman Biyalik's Story",
         imageUrl: tour1,
         description:
         'Get to know the Life of the Famous Israeli Poet',
      },
      {
         id: 4,
         name: "Haim Nachman Biyalik's Story",
         imageUrl: tour1,
         description:
         'Get to know the Life of the Famous Israeli Poet',
      },
      {
         id: 5,
         name: "Haim Nachman Biyalik's Story",
         imageUrl: tour1,
         description:
         'Get to know the Life of the Famous Israeli Poet',
      },
   ];

   const tour = tours.find((tour) => tour.id === parseInt(tourId));

   return (
    <>
    <NavBar/>
      <div className={styles.tour_page}>
         <h2 className={styles.tour_title}>{tour.name}</h2> <img src={tour.imageUrl} alt={tour.name} />
         <p>{tour.description}</p>
         <a style={{textDecoration: 'none'}} to='/bialik'>Start Tour!</a>
      </div>
    </>   
   );
};

export default TourPage;
