import "./Reviews.css";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactStarRatings from "react-star-ratings";
import StarRatingComponent from "react-rating-stars-component";
import React, { useState } from "react";

function ReviewForm(props) {
  const [rating, setRating] = useState(0);

  function handleChangeRating(value) {
    setRating(value);
  }

  function handleSubmit(event) {
    // event.preventDefault();
    const name = event.target.elements.name.value;
    const text = event.target.elements.text.value;
    const newReview = { name, rating, text };
    props.onSubmit(newReview);
  }

  return (
    <div className="review-form-container">
      <h2>הוסף ביקורת</h2>
      <Form className="ReviewsForm" onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="nameInput">
          <Form.Label htmlFor="name">שם:</Form.Label>
          <Form.Control type="text" id="name" name="name" placeholder="שם:" />
        </Form.Group>
        <br />
        <Form.Group className="mb-3" controlId="ratingInput">
          <Form.Label htmlFor="rating">דירוג:</Form.Label>
          <StarRatingComponent
            name="rating"
            starCount={5}
            value={rating}
            onStarClick={handleChangeRating}
            size={40}
          />
          <input type="hidden" name="rating" value={rating} />
        </Form.Group>
        <br />
        <Form.Group className="mb-3" controlId="textInput">
          <Form.Label htmlFor="text">משוב:</Form.Label>
          <Form.Control id="text" name="text" as="textarea" rows={3} />
        </Form.Group>
        <button className="submit-review" type="submit">
          שלח
        </button>
      </Form>
      {/* button to hide review form */}
      <button className="cancel" onClick={props.onCancel}>
        ביטול
      </button>
    </div>
  );
}

export default ReviewForm;
