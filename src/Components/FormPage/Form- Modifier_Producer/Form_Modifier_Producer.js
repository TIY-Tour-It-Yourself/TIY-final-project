import React, { useState } from "react";
import "./ProducerForm.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Button } from "react-bootstrap";

export function Form_Modifier_Producer() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [experience, setExperience] = useState("");
  const [theme, setTheme] = useState("");
  const [interest1, setInterest1] = useState("");
  const [interest2, setInterest2] = useState("");
  const [interest3, setInterest3] = useState("");
  const [interest4, setInterest4] = useState("");
  const [interest5, setInterest5] = useState("");
  const [userInterest, setUserInterest] = useState("");
  //   const [options, setOptions] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(
      `Date: ${date}, Time: ${time}, Experience: ${experience}, Theme: ${theme}, Interests: ${interest1} ${interest2}, ${interest3}, ${interest4}, ${interest5}`
    );
  };

  //   useEffect(() => {
  //     fetch("your-api-endpoint-url")
  //       .then((response) => response.json())
  //       .then((data) => setOptions(data))
  //       .catch((error) => console.log(error));
  //   }, []);

  // Filter the interest options based on the user input
  const filteredOptions = () => {
    const options = [
      { name: "Nature", lat: 37.7749, lng: -122.4194 },
      { name: "Architecture", lat: 40.7128, lng: -74.006 },
      { name: "Art", lat: 51.5074, lng: -0.1278 },
      { name: "Shopping", lat: 48.8566, lng: 2.3522 },
      { name: "Entertainment", lat: 34.0522, lng: -118.2437 },
      { name: "Sports", lat: 41.8781, lng: -87.6298 },
    ];

    return options.filter((option) =>
      option.name.toLowerCase().includes(userInterest.toLowerCase())
    );
  };
  return (
    <div className="Creation">
      <h6> Build your tour: </h6>{" "}
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
        <div>
          <br />
          <label> please choose POI(Point Of Interest): </label> <br />
          <label htmlFor="interest1"> POI 1: </label>{" "}
          <select
            className="POIS"
            id="interest1"
            value={interest1}
            onChange={(e) => setInterest1(e.target.value)}
            required
          >
            <option value=""> Select Interest 1 </option>{" "}
            {filteredOptions().map((option) => (
              <option key={option.name} value={option.name}>
                {option.name}
              </option>
            ))}{" "}
          </select>{" "}
          <br />
          <label htmlFor="interest2"> POI 2: </label>{" "}
          <select
            className="POIS"
            id="interest2"
            value={interest2}
            onChange={(e) => setInterest2(e.target.value)}
            required
          >
            <option value=""> Select Interest 2 </option>{" "}
            {filteredOptions().map((option) => (
              <option key={option.name} value={option.name}>
                {option.name}
              </option>
            ))}{" "}
          </select>{" "}
          <br />
          <label htmlFor="interest3"> POI 3: </label>{" "}
          <select
            className="POIS"
            id="interest3"
            value={interest3}
            onChange={(e) => setInterest3(e.target.value)}
            required
          >
            <option value=""> Select Interest 3 </option>{" "}
            {filteredOptions().map((option) => (
              <option key={option.name} value={option.name}>
                {option.name}
              </option>
            ))}{" "}
          </select>{" "}
          <br />
          <label htmlFor="interest4"> POI 4: </label>{" "}
          <select
            className="POIS"
            id="interest4"
            value={interest4}
            onChange={(e) => setInterest4(e.target.value)}
            required
          >
            <option value=""> Select Interest 4 </option>{" "}
            {filteredOptions().map((option) => (
              <option key={option.name} value={option.name}>
                {option.name}
              </option>
            ))}{" "}
          </select>{" "}
          <br />
          <label htmlFor="interest5"> POI 5: </label>{" "}
          <select
            className="POIS"
            id="interest5"
            value={interest5}
            onChange={(e) => setInterest5(e.target.value)}
            required
          >
            <option value=""> Select Interest 5 </option>
            {filteredOptions().map((option) => (
              <option key={option.name} value={option.name}>
                {option.name}
              </option>
            ))}
          </select>
          <br />
        </div>
        <br />
        <Button variant="primary" type="submit">
          Build Tour
        </Button>
      </Form>
    </div>
  );
}
