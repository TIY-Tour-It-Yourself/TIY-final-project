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

function Update_Route(props) {
  const [pois, setPOIs] = useState([]);
  const [themeOptions, setThemeOptions] = useState([]);
  const { selectedRoute, onCancel } = props;

  const [routeid, setRouteId] = useState(selectedRoute.routeid);
  const [description, setDescription] = useState(selectedRoute.description);
  const [evaluation_grade, setEvaluationGrade] = useState(
    selectedRoute.evaluation_grade
  );
  const [experience_level, setExperienceLevel] = useState(
    selectedRoute.experience_level
  );
  const [theme, setTheme] = useState(selectedRoute.theme.theme);
  const [imgurl, setImgUrl] = useState(selectedRoute.imgurl);

  const [newRouteId, setNewRouteId] = useState(props.lastRouteId + 1);
  console.log(newRouteId);

  useEffect(() => {
    fetch("https://tiys.herokuapp.com/api/pois")
      .then((response) => response.json())
      .then((data) => {
        setPOIs(data);
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

  const [formData, setFormData] = React.useState({
    routeid: routeid,
    description: description,
    pois: selectedRoute.pois,
    evaluation_grade: evaluation_grade,
    experience_level: experience_level,
    theme: theme,
    imgurl: imgurl,
  });

  // function handleChange(event) {
  //   const { name, value } = event.target;
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     [name]: value,
  //   }));
  // }

  function handleChange(event, index) {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      pois: prevFormData.pois.map((poi, i) =>
        i === index ? { ...poi, poiid: value } : poi
      ),
    }));
  }
  const handleChangeTheme = (event) => {
    const { theme, value } = event.target;
    console.log(event.target);
    setFormData((prevFormData) => ({ ...formData, theme: value }));
  };
  const handleChangeArLevel = (event) => {
    const { experience_level, value } = event.target;
    console.log(event.target);
    setFormData((prevFormData) => ({ ...formData, experience_level: value }));
  };
  const handleChangeImgUrl = (event) => {
    const { imgurl, value } = event.target;
    console.log(event.target);
    setFormData((prevFormData) => ({ ...formData, imgurl: value }));
  };
  //   function handleCoordinatesChange(event) {
  //     const { name, value } = event.target;
  //     setFormData((prevFormData) => ({
  //       ...prevFormData,
  //       pois: prevFormData.pois.map((poi, index) =>
  //         index === Number(name) ? { ...poi, lat: value } : { ...poi }
  //       ),
  //     }));
  //   }

  function handleCoordinatesChange(event, index) {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      pois: prevFormData.pois.map((poi, i) =>
        i === index ? { ...poi, [name]: value } : poi
      ),
    }));
  }

  function addPoi() {
    setFormData((prevFormData) => ({
      ...prevFormData,
      pois: [...prevFormData.pois, { poiid: "", name: "" }],
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log(formData);
    // handle form submit logic here
  }

  return (
    <div>
      <h2>Add New Route:</h2>
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
              value={formData.routeid}
              onChange={handleChange}
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="description"
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
            />{" "}
          </Grid>{" "}
          {formData.pois.map((poi, index) => (
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
                    onChange={(e) => handleChange(e, index)}
                    name={`pois[${index}].name`}
                  >
                    {pois.map((poiOption) => (
                      <MenuItem key={poiOption.poiid} value={poiOption.poiid}>
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
              variant="contained"
              color="primary"
              type="button"
              onClick={addPoi}
            >
              Add POI
            </Button>
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="evaluation_grade"
              label="Evaluation Grade"
              fullWidth
              value={formData.evaluation_grade}
              onChange={handleChange}
              disabled
            />{" "}
          </Grid>{" "}
          {/* <Grid item xs={6}>
            <TextField
              name="coordinates.lat"
              label="Latitude"
              fullWidth
              value={formData.coordinates.lat}
              onChange={handleCoordinatesChange}
            />{" "}
          </Grid>{" "} */}
          {/* <Grid item xs={6}>
            <TextField
              name="coordinates.lng"
              label="Longitude"
              fullWidth
              value={formData.coordinates.lng}
              onChange={handleCoordinatesChange}
            />{" "}
          </Grid>{" "} */}
          <Grid item xs={12}>
            <InputLabel id="experience-level-label">
              Experience Level
            </InputLabel>
            <Select
              labelId="experience-level-label"
              name="experience_level"
              fullWidth
              value={formData.experience_level}
              onChange={handleChangeArLevel}
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="theme-label">Theme</InputLabel>
              <Select
                labelId="theme-label"
                name="theme"
                value={formData.theme}
                onChange={handleChangeTheme}
              >
                {themeOptions.map((option) => (
                  <MenuItem key={option.themeid} value={option.themeid}>
                    {option.theme}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="imgurl"
              label="imgurl"
              fullWidth
              value={formData.imgurl}
              onChange={handleChangeImgUrl}
            />{" "}
          </Grid>{" "}
          <Grid item sx={{ display: "flex", justifyContent: "center" }}>
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </Grid>
        </Grid>{" "}
      </form>
    </div>
  );
}

export default Update_Route;
