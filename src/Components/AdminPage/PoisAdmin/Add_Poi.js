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
import { useNavigate, useLocation } from "react-router-dom";

function Add_Poi(props) {
  const selectedPoi = props.selectedPoi;
  const [newPoiId, setNewPoiId] = useState(props.lastRouteId + 1);
  const [themeOptions, setThemeOptions] = useState([]);
  const [activeImage, setActiveImage] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  console.log(selectedPoi);
  const [formData, setFormData] = React.useState({
    poiid: newPoiId + 1,
    name: "",
    description: "",
    address: "",
    coordinates: { lat: "", lng: "" },
    arid: "",
    theme: "",
  });

  // useEffect(() => {
  //   console.log(location);
  //   if (!location.state) {
  //     navigate("/");
  //   } else {
  //     setActiveImage(1);
  //     axios
  //       .get(`https://tiys.herokuapp.com/api/auth`, {
  //         headers: {
  //           "x-auth-token": location.state.token,
  //           "Content-Type": "application/json",
  //         },
  //       })
  //       .then((response) => {
  //         // console.log(response.data);   //user's data
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching user: ", error);
  //       });
  //   }
  // }, [location.state]);

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

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  const handleChangeTheme = (event) => {
    const { theme, value } = event.target;
    console.log(event.target);
    setFormData((prevFormData) => ({ ...formData, theme: value }));
  };

  function handleCoordinatesChange(event) {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      coordinates: {
        ...prevFormData.coordinates,
        [name]: value,
      },
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log(formData);
    // handle form submit logic here
  }

  return (
    <>
      {" "}
      {/* <NavBar activeImage={activeImage} /> */}
      <div style={{ height: "100%" }}>
        <h2>Add Point Of Interest(POI):</h2>
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
                name="poiid"
                label="Poi ID"
                fullWidth
                value={formData.poiid}
                onChange={handleChange}
                disabled
              />{" "}
            </Grid>{" "}
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Name"
                fullWidth
                value={formData.name}
                onChange={handleChange}
              />{" "}
            </Grid>{" "}
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
            <Grid item xs={12}>
              <TextField
                name="address"
                label="Address"
                fullWidth
                value={formData.address}
                onChange={handleChange}
              />{" "}
            </Grid>{" "}
            <Grid item xs={6}>
              <TextField
                name="coordinates.lat"
                label="Latitude"
                fullWidth
                value={formData.coordinates.lat}
                onChange={handleCoordinatesChange}
              />{" "}
            </Grid>{" "}
            <Grid item xs={6}>
              <TextField
                name="coordinates.lng"
                label="Longitude"
                fullWidth
                value={formData.coordinates.lng}
                onChange={handleCoordinatesChange}
              />{" "}
            </Grid>{" "}
            <Grid item xs={12}>
              <TextField
                name="arid"
                label="AR ID"
                fullWidth
                value={formData.arid}
                onChange={handleChange}
              />{" "}
            </Grid>{" "}
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
            <Grid item sx={{ display: "flex", justifyContent: "center" }}>
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
            </Grid>
          </Grid>{" "}
        </form>
      </div>
    </>
  );
}

export default Add_Poi;
