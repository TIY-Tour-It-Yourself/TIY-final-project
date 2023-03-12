import React from "react";
import tour1 from "./assets/tour1.jpg";
import { Link } from "react-router-dom";

export const TourPage = ({ tourId }) => {
  const tours = [
    {
      id: 1,
      name: "בעקבות חיים נחמן ביאליק",
      imageUrl: tour1,
      description:
        "בואו להכיר את חייו של המשורר הלאומי חיים נחמן ביאליק בעיר רמת גן ",
    },
    {
      id: 2,
      name: "בעקבות חיים נחמן ביאליק",
      imageUrl: tour1,
      description:
        "בואו להכיר את חייו של המשורר הלאומי חיים נחמן ביאליק בעיר רמת גן ",
    },
    {
      id: 3,
      name: "בעקבות חיים נחמן ביאליק",
      imageUrl: tour1,
      description:
        "בואו להכיר את חייו של המשורר הלאומי חיים נחמן ביאליק בעיר רמת גן ",
    },
    {
      id: 4,
      name: "בעקבות חיים נחמן ביאליק",
      imageUrl: tour1,
      description:
        "בואו להכיר את חייו של המשורר הלאומי חיים נחמן ביאליק בעיר רמת גן ",
    },
    {
      id: 5,
      name: "בעקבות חיים נחמן ביאליק",
      imageUrl: tour1,
      description:
        "בואו להכיר את חייו של המשורר הלאומי חיים נחמן ביאליק בעיר רמת גן ",
    },
  ];

  const tour = tours.find((tour) => tour.id === parseInt(tourId));

  return (
    <div className="tour-page">
      <h2> {tour.name} </h2> <img src={tour.imageUrl} alt={tour.name} />{" "}
      <p> {tour.description} </p> <Link to="/"> Back to Tours </Link>{" "}
    </div>
  );
};

export default TourPage;
