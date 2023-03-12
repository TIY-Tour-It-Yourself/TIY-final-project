import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Event.css";

export function Event() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await axios.post("http://localhost:5000/run_script");
      setEvents(response.data.events);
    };
    fetchEvents();
  }, []);

  return (
    <div className="event_board">
      <h1>
        <b>לוח אירועים עירוני</b>
      </h1>
      {events.map((event, index) => (
        <div key={index}>
          <p>{event}</p>
        </div>
      ))}
    </div>
  );
}
