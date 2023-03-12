import React from "react";
import "./Reviews.css";
import StarRatingComponent from "react-rating-stars-component";
import ReviewForm from "./ReviewForm";

function Reviews(props) {
  const { reviews } = props;

  return (
    <div className="reviews-container">
      <h4>ביקורות</h4>
      {reviews.map((review, index) => (
        <div className="review" key={index}>
          <div className="name">{review.name}</div>
          <div className="rating">
            {/* display stars based on the review rating */}
            <StarRatingComponent
              name={`rating-${index}`}
              starCount={5}
              value={review.rating}
              size={30}
              emptyStarColor={"#C4C4C4"}
              filledStarColor={"#F2C94C"}
            />
          </div>
          <p className="text">{review.text}</p>
        </div>
      ))}

      {/* button to show review form */}
      <button className="add-review" onClick={props.onAddReview}>
        הוסף ביקורת
      </button>
    </div>
  );
}

export default Reviews;
