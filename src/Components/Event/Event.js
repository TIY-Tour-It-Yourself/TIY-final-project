import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Event.css";

export function Event() {
  const [events, setEvents] = useState([]);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.post("http://127.0.0.1:5000/run_script");
        setEvents(response.data.events);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="event_board">
      <h1>
        <b> לוח אירועים עירוני </b>{" "}
      </h1>{" "}
      {isLoading ? (
        <p> Loading... </p>
      ) : (
        events.map((event, index) => (
          <div key={index}>
            <p> {event} </p>{" "}
          </div>
        ))
      )}{" "}
    </div>
  );
}
