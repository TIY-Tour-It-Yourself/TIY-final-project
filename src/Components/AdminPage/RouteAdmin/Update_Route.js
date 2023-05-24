import * as React from "react";
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button,
} from "@mui/material";
import { useState, useEffect } from "react";
import NavBar from "../../Additionals/NavBar/NavBar";
import axios from "axios";

function Update_Route(props) {
  const [themeOptions, setThemeOptions] = useState([]);
  const [poisData, setPoisData] = useState([]);

  useEffect(() => {
    fetch("https://tiys.herokuapp.com/api/pois")
      .then((response) => response.json())
      .then((data) => {
        setPoisData(data);
      })
      .catch((error) => {
        console.error("Error fetching POIs:", error);
      });
  }, []);
  useEffect(() => {
    fetch("https://tiys.herokuapp.com/api/themes")
      .then((response) => response.json())
      .then((data) => {
        setThemeOptions(data);
      })
      .catch((error) => {
        console.error("Error fetching POIs:", error);
      });
  }, []);

  const { selectedRoute, onCancel } = props;

  const [routeid, setRouteid] = useState(String(selectedRoute.routeid));
  const [description, setDescription] = useState(selectedRoute.description);
  const [pois, setPOIs] = useState(selectedRoute.pois);
  const [evaluation_grade, setEvaluation_grade] = useState(
    selectedRoute.evaluation_grade
  );
  const [experience_level, setExperience_level] = useState(
    selectedRoute.experience_level
  );
  const [theme, setTheme] = useState(selectedRoute.theme.theme || "");
  const [imgurl, setImageurl] = useState(selectedRoute.imgurl);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "routeid") {
      setRouteid(value);
    } else if (name === "description") {
      setDescription(value);
    } else if (name.startsWith("pois[")) {
      const index = Number(name.match(/\[(\d+)\]/)[1]);
      setPOIs((prevPOIs) => {
        const updatedPOIs = [...prevPOIs];
        updatedPOIs[index] = poisData.find((poi) => poi.poiid === value); // Find the selected POI object from poisData
        return updatedPOIs;
      });
    } else if (name === "evaluation_grade") {
      setEvaluation_grade(value);
    } else if (name === "experience_level") {
      setExperience_level(value);
    } else if (name === "theme") {
      setTheme(value);
    } else if (name === "imgurl") {
      setImageurl(value);
    }
  };

  function addPoi() {
    // setFormData((prevFormData) => ({
    //   ...prevFormData,
    //   pois: [...prevFormData.pois, { poiid: "", name: "" }],
    // }));
  }

  const poisArray = Object.values(pois).map((poi) => poi.poiid);
  console.log(poisArray);
  const handleSubmit = async (event) => {
    // event.preventDefault();
    console.log(
      routeid,
      description,
      poisArray,
      evaluation_grade,
      experience_level,
      theme.theme,
      imgurl
    );
    if (routeid && description && pois.length > 0) {
      await axios
        .put(`https://tiys.herokuapp.com/api/routes`, {
          routeid: routeid,
          description: description,
          pois: poisArray,
          evaluation_grade: evaluation_grade,
          experience_level: experience_level,
          theme: theme.theme,
          imgurl: imgurl,
        })
        .then((response) => {
          console.log(response);
          console.log(response.status);
        })
        .catch((err) => {
          console.log(err.response.data.errors[0]);
        });
    } else {
      alert("All fields are required, including at least one POI.");
    }
  };

  return (
    <div style={{ height: "100%" }}>
      <h2> Update New Route: </h2>{" "}
      <form onSubmit={handleSubmit}>
        <Grid
          container
          spacing={2}
          sx={{
            width: "100%",
            height: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Grid item xs={12}>
            <TextField
              name="routeid"
              label="Route ID"
              fullWidth
              value={routeid}
              onChange={(e) => handleInputChange(e)}
              disabled
            />{" "}
          </Grid>{" "}
          <Grid item xs={12}>
            <TextField
              name="description"
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={description}
              onChange={(e) => handleInputChange(e)}
            />{" "}
          </Grid>{" "}
          {pois.map((poi, index) => (
            <React.Fragment key={index}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id={`poi-id-${index}`}>
                    Poi ID {index + 1}
                  </InputLabel>
                  <Select
                    labelId={`poi-id-${index}`}
                    id={`poi-id-${index}`}
                    value={poi.poiid}
                    onChange={(e) => handleInputChange(e)}
                    name={`pois[${index}].poiid`} // Adjusted the name to target the "poiid" field
                  >
                    {poisData.map((poiOption, optionIndex) => (
                      <MenuItem
                        key={`${poiOption.poiid}-${optionIndex}`}
                        value={poiOption.poiid}
                      >
                        {poiOption.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </React.Fragment>
          ))}
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              key="add-poi-button" // Add a unique key
              variant="contained"
              color="primary"
              type="button"
              onClick={addPoi}
            >
              Add POI
            </Button>
          </Grid>{" "}
          <Grid item xs={12}>
            <TextField
              name="evaluation_grade"
              label="Evaluation Grade"
              fullWidth
              value={evaluation_grade}
              onChange={(e) => handleInputChange(e)}
              // disabled
            />{" "}
          </Grid>{" "}
          <Grid item xs={12}>
            <InputLabel id="experience-level-label">
              Experience Level{" "}
            </InputLabel>{" "}
            <Select
              labelId="experience-level-label"
              name="experience_level"
              fullWidth
              value={experience_level}
              onChange={(e) => handleInputChange(e)}
            >
              <MenuItem value={1}> 1 </MenuItem>{" "}
              <MenuItem value={2}> 2 </MenuItem>{" "}
              <MenuItem value={3}> 3 </MenuItem>{" "}
            </Select>{" "}
          </Grid>{" "}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="theme-label">Theme</InputLabel>
              {themeOptions.length > 0 && ( // Add this condition
                <Select
                  labelId="theme-label"
                  name="theme"
                  value={theme}
                  onChange={(e) => handleInputChange(e)}
                >
                  {themeOptions.map((option) => (
                    <MenuItem key={option.themeid} value={option.theme}>
                      {option.theme}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="imgurl"
              label="Image URL"
              fullWidth
              value={imgurl}
              onChange={(e) => handleInputChange(e)}
            />
          </Grid>
          <Grid item sx={{ display: "flex", justifyContent: "center" }}>
            <Button variant="contained" color="primary" type="submit">
              Update{" "}
            </Button>{" "}
          </Grid>{" "}
        </Grid>{" "}
      </form>{" "}
    </div>
  );
}

export default Update_Route;
