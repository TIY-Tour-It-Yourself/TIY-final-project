import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Form = () => {
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
        const coordinates = response.data.map((poi) => poi.coordinates);
        setCoordinates(coordinates);
        const names = response.data.map((poi) => poi.name);
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
    console.log(select1);
    navigate("/producer2", { state: { selectedValues } });
  };
  const markerPosition1 = { lat: 32.079596752557755, lng: 34.823331062420216 }; //Beit Yad Lebanim
  const markerPosition2 = { lat: 32.08380426675733, lng: 34.81488770244669 }; //Kikar Ramabam
  const markerPosition3 = { lat: 32.084531024037936, lng: 34.813179804299615 }; //Beit Bialik
  const markerPosition4 = { lat: 32.08632988098686, lng: 34.8183145058031 }; //Gan Avrahm

  return (
    <div>
      <h1>Please choose your POIs:</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Select 1:
          <select value={select1} onChange={(e) => setSelect1(e.target.value)}>
            <option value="">--Please select an option--</option>
            <option value={JSON.stringify(markerPosition1)}>
              markerPosition1
            </option>
            <option value={JSON.stringify(markerPosition2)}>
              markerPosition2
            </option>
            <option value={JSON.stringify(markerPosition3)}>
              markerPosition3
            </option>
            <option value={JSON.stringify(markerPosition4)}>
              markerPosition4
            </option>
          </select>
        </label>
        <br />
        <label>
          Select 2:
          <select value={select2} onChange={(e) => setSelect2(e.target.value)}>
            <option value="">--Please select an option--</option>
            <option value={JSON.stringify(markerPosition1)}>
              markerPosition1
            </option>
            <option value={JSON.stringify(markerPosition2)}>
              markerPosition2
            </option>
            <option value={JSON.stringify(markerPosition3)}>
              markerPosition3
            </option>
            <option value={JSON.stringify(markerPosition4)}>
              markerPosition4
            </option>
          </select>
        </label>
        <br />
        <label>
          Select 3:
          <select value={select3} onChange={(e) => setSelect3(e.target.value)}>
            <option value="">--Please select an option--</option>
            <option value={JSON.stringify(markerPosition1)}>
              markerPosition1
            </option>
            <option value={JSON.stringify(markerPosition2)}>
              markerPosition2
            </option>
            <option value={JSON.stringify(markerPosition3)}>
              markerPosition3
            </option>
            <option value={JSON.stringify(markerPosition4)}>
              markerPosition4
            </option>
          </select>
        </label>
        <br />
        <label>
          Select 4:
          <select value={select4} onChange={(e) => setSelect4(e.target.value)}>
            <option value="">--Please select an option--</option>
            <option value={JSON.stringify(markerPosition1)}>
              markerPosition1
            </option>
            <option value={JSON.stringify(markerPosition2)}>
              markerPosition2
            </option>
            <option value={JSON.stringify(markerPosition3)}>
              markerPosition3
            </option>
            <option value={JSON.stringify(markerPosition4)}>
              markerPosition4
            </option>
          </select>
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Form;
