import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const ThemeCustomization = () => {
   const [colors, setColors] = useState([]);
   const [counter, setCounter] = useState(0);
   const location = useLocation();
   const navigate = useNavigate();

   // CHECK: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage

   // useEffect(() => {
   //    console.log(`token: ${location.state.token}`);
   //    if (!location.state) {
   //       navigate('/');
   //    } else {
   //       axios
   //          .get(`https://tiys.herokuapp.com/api/auth`, {
   //             headers: {
   //                'x-auth-token': location.state.token,
   //                'Content-Type': 'application/json',
   //             },
   //          })
   //          .then((response) => {
   //             // console.log(response.data);
   //          })
   //          .catch((error) => {
   //             console.error('Error fetching user: ', error);
   //          });
   //    }
   // }, [location.state]);

   //Add the new color to the array
   // useEffect(() => {
   //    const handleMessage = (event) => {
   //       console.log(event.data);
   //       if (event.data === 'incrementCounter') {
   //          const newColor =
   //             '#' + Math.floor(Math.random() * 16777215).toString(16);
   //          setColors((prevColors) => [...prevColors, newColor]);
   //          setCounter((prevCounter) => prevCounter + 1);
   //       }
   //    };

   //    //Receive 'IncrementCounter' message from ar.html and handle it inside handleMessage()
   //    window.addEventListener('message', handleMessage);

   //    return () => {
   //       window.removeEventListener('message', handleMessage);
   //    };
   // }, []);

   useEffect(() => {
      console.log('customize app');
      const handler = (ev) => {
         console.log('ev: ', ev);
         if (typeof ev.data !== 'object') return;
         if (!ev.data.type) return;
         if (ev.data.type !== 'button-click') return;
         if (!ev.data.message) return;
         const newColor =
            '#' + Math.floor(Math.random() * 16777215).toString(16);
         setColors((prevColors) => [...prevColors, newColor]);
         setCounter((prevCounter) => prevCounter + 1);
      };

      // Listen for message events
      document.addEventListener('message', handler);

      // Remove event listener on unmount
      return () => {
         document.removeEventListener('message', handler);
      };
   }, []);

   //Return Randomly Generated Colors Array
   return colors.map((color, index) => <div key={index}>{color}</div>);
};

export default ThemeCustomization;
