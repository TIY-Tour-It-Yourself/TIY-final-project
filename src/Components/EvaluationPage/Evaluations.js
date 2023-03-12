import React, { useState } from "react";
import Reviews from "./Reviews";
import ReviewForm from "./ReviewForm";
import "./Reviews.css";

export function Evaluations() {
  const [reviews, setReviews] = useState([
    { id: 1, rating: 4, name: "יוסי", text: "מאוד אהבתי את המקום!" },
    { id: 2, rating: 3, name: "שני", text: "מאוד אהבתי את המקום!" },
    { id: 3, rating: 5, name: "רוני", text: "מאוד אהבתי את המקום!" },
    { id: 4, rating: 5, name: "רוני", text: "מאוד אהבתי את המקום!" },
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
      <Reviews reviews={reviews} onAddReview={handleAddReview} />{" "}
      <div className="average-rating">
        Average Rating: {calculateAverageRating().toFixed(1)}{" "}
      </div>{" "}
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
