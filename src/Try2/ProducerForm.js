import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Form2 = () => {
  const [select1, setSelect1] = useState("");
  const [select2, setSelect2] = useState("");
  const [select3, setSelect3] = useState("");
  const [select4, setSelect4] = useState("");
  const [coordinates, setCoordinates] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://tiys.herokuapp.com/api/pois")
      .then((response) => {
        setCoordinates(response.data);
      })
      .catch((error) => {
        console.error("Error fetching POIs: ", error);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const selectedValues = {
      select1: JSON.parse(select1),
      select2: JSON.parse(select2),
      select3: JSON.parse(select3),
      select4: JSON.parse(select4),
    };
    navigate("/producer", { state: { selectedValues, coordinates } });
  };

  return (
    <div>
      <h1>Please choose your POIs:</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Select 1:
          <select value={select1} onChange={(e) => setSelect1(e.target.value)}>
            <option value="">--Please select an option--</option>
            {coordinates.map((poi) => (
              <option key={poi.id} value={JSON.stringify(poi.coordinates)}>
                {poi.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Select 2:
          <select value={select2} onChange={(e) => setSelect2(e.target.value)}>
            <option value="">--Please select an option--</option>
            {coordinates.map((poi) => (
              <option key={poi.id} value={JSON.stringify(poi.coordinates)}>
                {poi.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Select 3:
          <select value={select3} onChange={(e) => setSelect3(e.target.value)}>
            <option value="">--Please select an option--</option>
            {coordinates.map((poi) => (
              <option key={poi.id} value={JSON.stringify(poi.coordinates)}>
                {poi.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Select 4:
          <select value={select4} onChange={(e) => setSelect4(e.target.value)}>
            <option value="">--Please select an option--</option>
            {coordinates.map((poi) => (
              <option key={poi.id} value={JSON.stringify(poi.coordinates)}>
                {poi.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Form2;
