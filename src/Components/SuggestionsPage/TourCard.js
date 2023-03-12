import React from "react";
import { Link } from "react-router-dom";
import "./TourCard.css";

const TourCard = ({ tour }) => {
  console.log(tour);
  return (
    <div className="tour-card">
      <Link to={tour.link}>
        <img src={tour.imageUrl} alt={tour.name} />
        <h3>{tour.name}</h3>
        <p>{tour.description}</p>
      </Link>
    </div>
  );
};

export default TourCard;
