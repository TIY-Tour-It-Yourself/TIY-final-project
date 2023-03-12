import React, { useState } from "react";
import "./Form_Consumer.module.css";
// import "./ConsumerForm.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Form, Button } from "react-bootstrap";
/*
export function Form_Consumer() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [experience, setExperience] = useState("");
  const [theme, setTheme] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(
      `Date: ${date}, Time: ${time}, Experience: ${experience}, Theme: ${theme}`
    );
  };

  return (
    <div className="Creation">
      <h6>
        {" "}
        Fill in your preferences for receiving <br /> routes suggestion:
      </h6>{" "}
      <Form className="CreationForm" onSubmit={handleSubmit}>
        <label> please choose date & time: </label> <br />
        <input
          type="date"
          className="date"
          placeholder="Select date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          type="time"
          className="time"
          placeholder="Select time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
        <div className="AR">
          <label> Please choose AR experience: </label> <br />
          <input
            type="radio"
            id="Intermediate"
            name="experience"
            value="Intermediate"
            checked={experience === "Intermediate"}
            onChange={(e) => setExperience(e.target.value)}
            required
          />
          <label htmlFor="Intermediate"> Intermediate </label> <br />
          <input
            type="radio"
            id="Advanced"
            name="experience"
            value="Advanced"
            checked={experience === "Advanced"}
            onChange={(e) => setExperience(e.target.value)}
            required
          />
          <label htmlFor="Advanced"> Advanced </label> <br />
          <input
            type="radio"
            id="Professional"
            name="experience"
            value="Professional"
            checked={experience === "Professional"}
            onChange={(e) => setExperience(e.target.value)}
            required
          />
          <label htmlFor="Professional"> Professional </label>{" "}
        </div>{" "}
        <input
          className="theme"
          type="text"
          list="theme-options"
          id="theme"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder="Theme of the tour :"
          required
        />
        <datalist id="theme-options">
          <option value="Sport" />
          <option value="Music" />
          <option value="Culture" />
          <option value="Food" />
          <option value="History" />
          <option value="Education" />
        </datalist>{" "}
        <br />
        <Button variant="primary" type="submit">
          Submit{" "}
        </Button>{" "}
      </Form>{" "}
    </div>
  );
}

export default Form_Consumer;*/