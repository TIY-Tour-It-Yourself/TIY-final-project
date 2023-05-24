// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./Event.css";

// export function Event() {
//   const [events, setEvents] = useState([]); // State to hold the events
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const response = await axios.post("http://127.0.0.1:5000/run_script");
//         setEvents(response.data.events);
//         setIsLoading(false);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchEvents();
//   }, []);

//   return (
//     <div className="event_board">
//       <h1>
//         <b> municipal events </b>{" "}
//       </h1>{" "}
//       {isLoading ? (
//         <p> Loading... </p>
//       ) : (
//         events.map((event, index) => (
//           <div key={index}>
//             <p>
//               {event.title}
//               <br />
//               {event.location}
//               <br />
//               {event.address}
//               <br />
//               {event.date}
//             </p>
//             {/* Uncomment the line below if "date" property is included in the event dictionary */}
//             {/* <p>Date: {event.date}</p> */}
//           </div>
//         ))
//       )}{" "}
//     </div>
//   );
// }
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Event.css";
import { useLocation, useNavigate } from "react-router-dom";

export function Event() {
  const [events, setEvents] = useState([]); // State to hold the events
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [isSelectingEvents, setIsSelectingEvents] = useState(false);
  const location = useLocation();

  const shouldLog = useRef(true);
  useEffect(() => {
    console.log(location.state);
    if (shouldLog.current) {
      shouldLog.current = false;
      console.log("token loaded");
      if (!location.state) {
        navigate("/");
      } else {
        axios
          .get(`https://tiys.herokuapp.com/api/auth`, {
            headers: {
              "x-auth-token": location.state.token,
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            // setEmail(response.data.email);
          })
          .catch((error) => {
            console.error("Error fetching user: ", error);
          });
      }
    }
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.post("http://127.0.0.1:5000/run_script");
        const eventsWithCoordinates = await geocodeEvents(response.data.events);
        setEvents(eventsWithCoordinates);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEvents();
  }, []);

  const geocodeEvents = async (events) => {
    const apiKey = "AIzaSyCQU9JxGT74zn0qE5vpvygu8cxLGKd80OM";

    const geocodeAddress = async (address) => {
      const fullAddress = `${address}, Ramat Gan, Israel`;
      const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        fullAddress
      )}&key=${apiKey}`;

      const response = await axios.get(apiUrl);

      if (response.data.status === "OK") {
        const { lat, lng } = response.data.results[0].geometry.location;
        return { ...address, lat, lng };
      } else {
        console.log(`Geocoding failed for address: ${address}`);
        return address;
      }
    };

    const geocodedEvents = await Promise.all(
      events.map(async (event) => {
        const geocodedAddress = await geocodeAddress(event.address);
        const coordinates = {
          lat: geocodedAddress.lat,
          lng: geocodedAddress.lng,
        };
        return { ...event, coordinates };
      })
    );

    return geocodedEvents;
  };

  const handleEventClick = (event) => {
    const isSelected = selectedEvents.some(
      (selectedEvent) => selectedEvent.id !== event.id
    );
    let updatedSelectedEvents = [];

    if (isSelected) {
      updatedSelectedEvents = selectedEvents.filter(
        (selectedEvent) => selectedEvent.id !== event.id
      );
    } else {
      updatedSelectedEvents = [...selectedEvents, event];
    }

    setSelectedEvents(updatedSelectedEvents);
    console.log(updatedSelectedEvents);
    setIsSelectingEvents(true);
  };

  const handleEventSelectionComplete = () => {
    setIsSelectingEvents(false);
  };

  return (
    <div className="event_board">
      <h1>
        <b>municipal events</b>
      </h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {isSelectingEvents ? (
            <>
              <p>Selected events:</p>
              {selectedEvents.map((event, index) => (
                <div
                  key={index}
                  onClick={() => handleEventClick(event)}
                  className="event_div selected"
                >
                  <p>
                    {event.title}
                    <br />
                    {event.location}
                    <br />
                    {event.address}
                    <br />
                    {event.coordinates.lat}, {event.coordinates.lng}
                    <br />
                    {event.date}
                  </p>
                </div>
              ))}
              {events.map(
                (event, index) =>
                  !selectedEvents.includes(event) && (
                    <div
                      key={index}
                      onClick={() => handleEventClick(event)}
                      className="event_div"
                    >
                      <p>
                        {event.title}
                        <br />
                        {event.location}
                        <br />
                        {event.address}
                        <br />
                        {event.coordinates.lat}, {event.coordinates.lng}
                        <br />
                        {event.date}
                      </p>
                    </div>
                  )
              )}
              <button
                onClick={() =>
                  navigate("/map_builder", {
                    state: { token: location.state.token, selectedEvents },
                  })
                }
              >
                View Selected Events on Map
              </button>
            </>
          ) : (
            <>
              <p>Click on an event to start selecting:</p>
              {events.map((event, index) => (
                <div
                  key={index}
                  onClick={() => handleEventClick(event)}
                  className={`event_div ${
                    selectedEvents.includes(event) ? "selected" : ""
                  }`}
                >
                  <p>
                    {event.title}
                    <br />
                    {event.location}
                    <br />
                    {event.address}
                    <br />
                    {event.coordinates.lat}, {event.coordinates.lng}
                    <br />
                    {event.date}
                  </p>
                </div>
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
}
