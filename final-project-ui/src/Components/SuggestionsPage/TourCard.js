import React from "react";
import { Link } from "react-router-dom";
import styles from "./TourCard.module.css";

const TourCard = ({ tour }) => {
  console.log(tour);
  return (
    <div className={styles.tour_card}>
      <Link to={tour.link} style={{textDecoration: 'none'}}>
        <img src={tour.imageUrl} alt={tour.name} />
        <h3>{tour.name}</h3>
        <p>{tour.description}</p>
      </Link>
    </div>
  );
};

export default TourCard;