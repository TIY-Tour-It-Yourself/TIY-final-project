import React, { useState } from "react";
import Reviews from "./Reviews";
import ReviewForm from "./ReviewForm";
import "./Reviews.css";

export function Evaluations() {
  const [reviews, setReviews] = useState([
    { id: 1, rating: 4, name: "Yosi", text: "Very intersting tour!" },
    { id: 2, rating: 3, name: "Shany", text: "Very intersting tour!" },
    { id: 3, rating: 5, name: "Rony", text: "Very intersting tour!" },
    { id: 4, rating: 5, name: "Avi", text: "Very intersting tour!" },
  ]);
  const [showForm, setShowForm] = useState(false);

  function handleAddReview() {
    setShowForm(true);
  }

  function handleCancel() {
    setShowForm(false);
  }

  // useEffect(() => {
  //   fetch("https://your-api-endpoint.com/reviews")
  //     .then(response => response.json())
  //     .then(data => setReviews(data))
  //     .catch(error => console.error(error));
  // }, []);

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
      <h5 className="header"> Reviwes </h5>{" "}
      <div className="average-rating">
        Average Rating: {calculateAverageRating().toFixed(1)}{" "}
      </div>{" "}
      <Reviews reviews={reviews} onAddReview={handleAddReview} />{" "}
      {showForm && (
        <div className="lightbox">
          <div className="lightbox-content">
            <ReviewForm onSubmit={handleSubmit} onCancel={handleCancel} />{" "}
          </div>{" "}
        </div>
      )}{" "}
    </div>
  );
}
