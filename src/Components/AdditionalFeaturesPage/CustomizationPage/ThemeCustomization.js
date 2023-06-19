import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const ThemeCustomization = () => {
  const [colors, setColors] = useState([]);
  const [counter, setCounter] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState("No data received from IFrame, yet.");

  const initialRenderRef = useRef(true); // Create a mutable reference for initial render state
  const handlerRef = useRef(null); // Create a mutable reference for the event handler

  const ref = useRef();
  const shouldLog = useRef(true);
  useEffect(() => {
    if (shouldLog.current) {
      shouldLog.current = false;

      console.log("customize app");
      const handler = (ev) => {
        console.log("ev: ", ev);
        if (typeof ev.data !== "object") return;
        if (!ev.data.type) return;
        if (ev.data.type !== "button-click") return;
        if (!ev.data.message) return;
        // const newColor =
        //    '#' + Math.floor(Math.random() * 16777215).toString(16);
        // setColors((prevColors) => [...prevColors, newColor]);
        // setCounter((prevCounter) => prevCounter + 1);
        setMessage(ev.data.message);
      };

      window.addEventListener("message", handler);
      // Clean up
      return () => window.removeEventListener("message", handler); // The "message" param should match with the iframe.js file
    }
  }, []);
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
  //    console.log('customize app');
  //    const handler = (ev) => {
  //       console.log('ev: ', ev);
  //       if (typeof ev.data !== 'object') return;
  //       if (!ev.data.type) return;
  //       if (ev.data.type !== 'button-click') return;
  //       if (!ev.data.message) return;
  //       const newColor =
  //          '#' + Math.floor(Math.random() * 16777215).toString(16);
  //       setColors((prevColors) => [...prevColors, newColor]);
  //       setCounter((prevCounter) => prevCounter + 1);
  //    };

  //    handlerRef.current = handler; // Assign the handler function to the mutable reference

  //    // Check if it's the initial render
  //    if (!handlerRef.current) {
  //       // Listen for message events
  //       window.addEventListener('message', handlerRef.current);
  //       console.log(colors);
  //    } else {
  //       handlerRef.current = false; // Set the initial render state to false
  //    }
  //    // Listen for message events
  //    window.addEventListener('message', handlerRef.current);
  //    console.log(colors);
  //    // Remove event listener on unmount
  //    return () => {
  //       window.removeEventListener('message', handlerRef.current);
  //    };
  // }, [colors]);

  //Return Randomly Generated Colors Array
  return (
    <div>
      <div
        style={{
          marginTop: "80px",
        }}
      >
        <h2
          style={{
            marginTop: "10px",
          }}
        >
          Colors:
        </h2>
      </div>
      {message}
      {/* {colors.map((color, index) => (
            <div key={index}>{color}</div>
         ))} */}
    </div>
  );
};

export default ThemeCustomization;
