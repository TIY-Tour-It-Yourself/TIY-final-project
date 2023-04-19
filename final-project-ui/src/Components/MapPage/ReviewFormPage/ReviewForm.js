import styles from './ReviewForm.module.css';
import Rating from '@mui/material/Rating';
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Typography } from '@mui/material';

function ReviewForm(props) {
  const location = useLocation();
  const [numOfPois, setNumOfPois] = useState(null);
  const [rating, setRating] = useState('');
  const poiid = props.poiValues;
  const [poiData, setPoiData] = useState(null);
  const [name, setName] = useState([]);
  const [isNamesLoaded, setIsNamesLoaded] = useState(false);
  // console.log(poiValues);

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
    
    axios.put('https://tiys.herokuapp.com/api/pois/evaluate', newEvaluation)
      .then(response => {
        console.log(response.data); // Log the response from the server
        // Call the onSubmit callback function to update the state with the new review
        // props.onSubmit(newgrade);
      })
      .catch(error => {
        console.error(error);
      });
      props.onCancel(); // close the modal
  }

  // function handleSubmit(event) {
  //   const newReview = { rating };
  //   props.onSubmit(newReview);
  //   window.history.back();
  // }

  function handleCancel() {
    window.history.back();
  }
  return (
    <div>
      <div className={styles.review_form_container}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h4 style={{ textAlign: "center" }}>{name}</h4>
        </div>
        <h5 className={styles.HeaderForm}> How was your experience in {name}?</h5>
        <form className={styles.ReviewsForm} onSubmit={handleSubmit}>
          <br />
            <Typography component='div'><h2>Ranking:</h2></Typography>
            <Rating 
              name="rating"
              value={rating ? Number(rating) : 0}
              className={styles.stars}
              // onClick={handleChangeRating}
              onChange={(event, newValue) => {
                  setRating(newValue);
              }}
            />
            <input type="hidden" name="rating" value={Number(rating) || 0} />
          <br />
          <button className={styles.submit_review} type="submit">
            Submit
          </button>
          {/* <button className="cancel" onClick={props.onCancel}>
          Cancle
        </button> */}
          {/* <button className="cancel" onClick={handleCancel}>
            To Previous Page
          </button> */}
        </form>
        {/* button to hide review form */}
      </div>
    </div>
  );
}

export default ReviewForm;
