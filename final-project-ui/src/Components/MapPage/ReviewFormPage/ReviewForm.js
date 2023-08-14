import styles from './ReviewForm.module.css';
import Rating from '@mui/material/Rating';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Typography, Button } from '@mui/material';

function ReviewForm(props) {
   const location = useLocation();
   const [numOfPois, setNumOfPois] = useState(null);
   const [rating, setRating] = useState('');
   const poiid = props.poiValues;
   const email = props.email;
   const [poiData, setPoiData] = useState(null);
   const [name, setName] = useState([]);
   const [isNamesLoaded, setIsNamesLoaded] = useState(false);

   useEffect(() => {
      //Get POIs from the Database
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

   const handleSubmit = async (event) => {
      event.preventDefault();
      const newgrade = rating;

      const response = await axios
         .post('https://tiys.herokuapp.com/api/grades', {
            poiid: poiid,
            email: email,
            grade: newgrade,
         })
         .then((response) => {
            alert(response.data);
         })
         .catch((error) => {
            alert(error.response.data);
         });
      props.onCancel(); // close the modal
   };

   return (
      <div>
         <div className={styles.review_form_container}>
            <div className={styles.header_title}>
               <h4>{name}</h4>
            </div>
            <h5 className={styles.header_form}>
               How was your experience in {name}?
            </h5>
            <form className={styles.reviews_form} onSubmit={handleSubmit}>
               <br />
               <Typography component='div' sx={{ fontSize: '1rem' }}>
                  <h3 style={{ color: 'green' }}>Rank the location:</h3>
               </Typography>
               <Rating
                  name='rating'
                  defaultValue={1}
                  max={4}
                  value={rating ? Number(rating) : 0}
                  className={styles.stars}
                  onChange={(newValue) => {
                     setRating(newValue);
                  }}
               />
               <input type='hidden' name='rating' value={Number(rating) || 0} />
               <br />
               <Button
                  sx={{
                     backgroundColor: '#868686',
                     color: 'white',
                     marginTop: 2,
                     marginBottom: 1,
                  }}
                  type='submit'
               >
                  Submit
               </Button>
            </form>
         </div>
      </div>
   );
}

export default ReviewForm;
