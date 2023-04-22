import React, { useState } from "react";
import Reviews from "./Reviews";
import ReviewForm from "./ReviewForm";
import axios from "axios";

import "./Reviews.css";

export function Evaluations() {
  // const [reviews, setReviews] = useState([]);

  const [reviews, setReviews] = useState([
    { id: 1, rating: 4, name: "Yosi", text: "Very intersting tour!" },
    { id: 2, rating: 3, name: "Shany", text: "Very intersting tour!" },
    { id: 3, rating: 5, name: "Rony", text: "Very intersting tour!" },
    { id: 4, rating: 5, name: "Avi", text: "Very intersting tour!" },
  ]);
  const [showForm, setShowForm] = useState(false);

  // useEffect(() => {
  //   async function fetchReviews() {
  //     try {
  //       const response = await axios.get("/api/reviews");
  //       setReviews(response.data);
  //     } catch (error) {
  //       console.error("Error fetching reviews:", error);
  //     }
  //   }

  //   fetchReviews();
  // }, []);

  function handleAddReview() {
    setShowForm(true);
  }

  function handleCancel() {
    setShowForm(false);
  }

  function handleSubmit(event) {
    const name = event.target.elements.name.value;
    const text = event.target.elements.text.value;
    const ratingValue = parseInt(event.target.elements.rating.value);
    const newReview = {
      id: reviews.length + 1,
      name,
      rating: ratingValue,
      text,
    };
    setReviews([...reviews, newReview]);
    setShowForm(false);
  }

  function calculateAverageRating() {
    const totalRatings = reviews.reduce((acc, cur) => acc + cur.rating, 0);
    const averageRating = totalRatings / reviews.length;
    return isNaN(averageRating) ? 0 : averageRating;
  }

  return (
    <div className={`app-container ${showForm ? "dark" : ""}`}>
      <h5 className="header"> Reviews </h5>{" "}
      <div className="average-rating">
        Average Rating: {calculateAverageRating().toFixed(1)}{" "}
      </div>{" "}
      <Reviews reviews={reviews} onAddReview={handleAddReview} />{" "}
      {showForm && (
        <div className="lightbox">
          <div className="lightbox-content">
            <ReviewForm onSubmit={handleSubmit} onCancel={handleCancel} />{" "}
          </div>
        </div>
      )}
    </div>
  );
}
