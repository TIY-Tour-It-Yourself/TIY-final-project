import "./Reviews.css";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactStarRatings from "react-star-ratings";
import StarRatingComponent from "react-rating-stars-component";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

function ReviewForm(props) {
  const location = useLocation();
  const [numOfPois, setNumOfPois] = useState(null);
  const [rating, setRating] = useState(0);
  const poiid = props.poiValues;
  const [poiData, setPoiData] = useState(null);
  const [name, setName] = useState([]);
  const [isNamesLoaded, setIsNamesLoaded] = useState(false);
  // console.log(poiid);
  useEffect(() => {
    // get poi from the database
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://tiys.herokuapp.com/api/pois/${poiid}`
        );
        setPoiData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [poiid]);

  useEffect(() => {
    if (poiData && poiData.length > 0) {
      const newName = poiData.map((item) => item.name);
      setName(newName);
      setIsNamesLoaded(true);
    }
  }, [poiData]);

  // useEffect(() => {
  //   const searchParams = new URLSearchParams(location.search);
  //   const numOfPoisParam = searchParams.get("numOfPois");
  //   setNumOfPois(numOfPoisParam);
  //   console.log(numOfPois);
  // }, [location, numOfPois]);

  function handleChangeRating(value) {
    setRating(value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const newgrade = rating; // You can replace this with the actual rating value
    const newEvaluation = { poiid, newgrade };

    axios
      .put("https://tiys.herokuapp.com/api/pois/evaluate", newEvaluation)
      .then((response) => {
        // console.log(response.data); // Log the response from the server
        // Call the onSubmit callback function to update the state with the new review
        // props.onSubmit(newgrade);
      })
      .catch((error) => {
        console.error(error);
      });

    props.onCancel(); // close the modal
  }

  return (
    <div>
      <div className="review-form-container">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h4 style={{ textAlign: "center" }}> {name} </h4>{" "}
        </div>{" "}
        <h5 className="HeaderForm"> How Was Your Experience ? </h5>{" "}
        <Form className="ReviewsForm" onSubmit={handleSubmit}>
          {" "}
          {/* <Form.Group className="mb-3">
                        <Form.Label htmlFor="name"> Name: </Form.Label>{" "}
                        <Form.Control
                          type="text"
                          id="name"
                          name="name"
                          placeholder="name:"
                        />
                      </Form.Group> */}{" "}
          <br />
          <Form.Group className="mb-3 ">
            <Form.Label htmlFor="rating"> Ranking : </Form.Label>{" "}
            <StarRatingComponent
              name="rating"
              starCount={5}
              value={rating}
              onStarClick={handleChangeRating}
              size={40}
            />{" "}
            <input type="hidden" name="rating" value={rating} />{" "}
          </Form.Group>{" "}
          <br />{" "}
          {/* <Form.Group className="mb-3">
                        <Form.Label htmlFor="text"> Review: </Form.Label>{" "}
                        <Form.Control id="text" name="text" as="textarea" rows={3} />{" "}
                      </Form.Group> */}{" "}
          <button className="submit-review" type="submit">
            Submit{" "}
          </button>{" "}
          {/* <button className="cancel" onClick={props.onCancel}>
                      Cancle
                    </button> */}{" "}
          {/* <button className="cancel" onClick={handleCancel}>
                        To Previous Page
                      </button> */}{" "}
        </Form>{" "}
        {/* button to hide review form */}{" "}
      </div>{" "}
    </div>
  );
}

export default ReviewForm;
