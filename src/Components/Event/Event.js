import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Event.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";

export function Event() {
  const [events, setEvents] = useState([]); // State to hold the events
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [isSelectingEvents, setIsSelectingEvents] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  const [title, setTitle] = useState([]);
  const [address, setAddress] = useState([]);
  const [Location, setLocation] = useState([]);
  const [date, setDate] = useState([]);
  const [translatedEvent, setTranslatedEvent] = useState([]);

  const translateText = async (text, targetLanguage) => {
    const apiKey = "AIzaSyBTcp_fIBVNuxgqiuv4wqyTLfFC6iGm0iE&libraries=places";
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        target: targetLanguage,
      }),
    });
    const data = await response.json();
    return data.data.translations[0].translatedText;
  };

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
        const response = await axios.get(
          "https://tiy-poc.glitch.me/events.json"
        );
        const translatedEvents = await Promise.all(
          response.data.map(async (event) => {
            const translatedTitle = await translateText(event.title, "en");
            setTitle(translatedTitle);
            const translatedAddress = await translateText(event.address, "en");
            setAddress(translatedAddress);
            const translatedLocation = await translateText(
              event.location,
              "en"
            );
            setLocation(translatedLocation);
            const translatedDate = await translateText(event.date, "en");
            setDate(translatedDate);

            return {
              ...event,
              title: translatedTitle,
              address: translatedAddress,
              location: translatedLocation,
              date: translatedDate,
            };
          })
        );

        const eventsWithCoordinates = await geocodeEvents(response.data);
        setEvents(eventsWithCoordinates);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEvents();
  }, []);

  const geocodeEvents = async (events) => {
    const apiKey = "AIzaSyBTcp_fIBVNuxgqiuv4wqyTLfFC6iGm0iE";

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
    console.log(events);
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
    navigate(-1, { state: { selectedEvents } });
  };
  var routeChosen = 1;

  return (
    <div className="event_board">
      <h1>
        <b> municipal events </b>{" "}
      </h1>{" "}
      {isLoading ? (
        <p> Loading... </p>
      ) : (
        <>
          {" "}
          {isSelectingEvents ? (
            <>
              <h3> Selected events: </h3>{" "}
              <Button
                variant="contained"
                onClick={() =>
                  navigate(
                    `/map_builder?routeId=1&selectedEvents=${encodeURIComponent(
                      JSON.stringify(selectedEvents)
                    )}`,
                    {
                      state: {
                        token: location.state.token,
                      },
                    }
                  )
                }
              >
                View Selected Events on Map{" "}
              </Button>{" "}
              {selectedEvents.map((event, index) => (
                <div
                  key={index}
                  onClick={() => handleEventClick(event)}
                  className="event_div selected"
                >
                  <p>
                    {event.title} <br /> {event.location} <br /> {event.address}{" "}
                    <br /> {event.coordinates.lat}, {event.coordinates.lng}{" "}
                    <br /> {event.date}{" "}
                  </p>{" "}
                </div>
              ))}{" "}
              {events.map(
                (event, index) =>
                  !selectedEvents.includes(event) && (
                    <div
                      key={index}
                      onClick={() => handleEventClick(event)}
                      className="event_div"
                    >
                      <p>
                        {" "}
                        <b>{title}</b>
                        {/* {event.title}  */}
                        <br /> {event.location} <br /> {event.address} <br />{" "}
                        {/* {event.coordinates.lat}, {event.coordinates.lng} <br />{" "} */}
                        {event.date}{" "}
                      </p>
                      {console.log(selectedEvents)}
                    </div>
                  )
              )}{" "}
            </>
          ) : (
            <>
              <h3> Click on an event to start selecting: </h3>{" "}
              {events.map((event, index) => (
                <div
                  key={index}
                  onClick={() => handleEventClick(event)}
                  className={`event_div ${
                    selectedEvents.includes(event) ? "selected" : ""
                  }`}
                >
                  <p>
                    {" "}
                    {event.title} <br /> {event.location} <br /> {event.address}{" "}
                    {/* <br /> {event.coordinates.lat}, {event.coordinates.lng}{" "} */}
                    <br /> {event.date}{" "}
                  </p>{" "}
                </div>
              ))}{" "}
            </>
          )}{" "}
        </>
      )}{" "}
    </div>
  );
}
