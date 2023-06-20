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
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Pois_Table.module.css";

function Update_Poi(props) {
  const selectedPoi = props.selectedPoi;
  const [themeOptions, setThemeOptions] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { onCancel } = props;

  const [poiid, setPoiid] = useState(selectedPoi.poiid);
  const [name, setName] = useState(selectedPoi.name);
  const [description, setDescription] = useState(selectedPoi.description);
  const [address, setAddress] = useState(selectedPoi.address);
  const [coordinates, setCoordinates] = useState({
    lat: selectedPoi.coordinates.lat,
    lng: selectedPoi.coordinates.lng,
  });
  const [arid, setArid] = useState(selectedPoi.arid.arid);
  const [theme, setTheme] = useState(selectedPoi.theme.theme || "");

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "poiid") {
      setPoiid(value);
    } else if (name === "name") {
      setName(value);
    } else if (name === "description") {
      setDescription(value);
    } else if (name === "address") {
      setAddress(value);
    } else if (name === "coordinates.lat") {
      setCoordinates((prevCoordinates) => ({
        ...prevCoordinates,
        lat: value,
      }));
    } else if (name === "coordinates.lng") {
      setCoordinates((prevCoordinates) => ({
        ...prevCoordinates,
        lng: value,
      }));
    } else if (name === "arid") {
      setArid(value);
    } else if (name === "theme") {
      setTheme(value);
    }
  };

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (poiid) {
      try {
        const response = await axios.put(
          `https://tiys.herokuapp.com/api/pois`,
          {
            poiid: poiid,
            name: name,
            description: description,
            address: address,
            coordinates: {
              lat: coordinates.lat,
              lng: coordinates.lng,
            },
            arid: arid,
            theme: theme,
          }
        );
        // Close the modal
        onCancel();

        // Refresh the page
        window.location.reload();
      } catch (err) {
        console.log(err.response.data.errors);
      }
    } else {
      alert("All fields are required.");
    }
  };

  return (
    <>
      <div className={styles.update_poi}>
        <h2> Update Point Of Interest(POI): </h2>{" "}
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
                value={poiid}
                onChange={(e) => handleInputChange(e)}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Name"
                fullWidth
                value={name}
                onChange={(e) => handleInputChange(e)}
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
                // onChange={handleChange}
                onChange={(e) => handleInputChange(e)}
              />{" "}
            </Grid>{" "}
            <Grid item xs={12}>
              <TextField
                name="address"
                label="Address"
                fullWidth
                value={address}
                // onChange={handleChange}
                onChange={(e) => handleInputChange(e)}
              />{" "}
            </Grid>{" "}
            <Grid item xs={6}>
              <TextField
                name="coordinates.lat"
                label="Latitude"
                fullWidth
                value={coordinates.lat}
                // onChange={handleCoordinatesLat}
                onChange={(e) => handleInputChange(e)}
              />{" "}
            </Grid>{" "}
            <Grid item xs={6}>
              <TextField
                name="coordinates.lng"
                label="Longitude"
                fullWidth
                value={coordinates.lng}
                // onChange={handleCoordinatesLng}
                onChange={(e) => handleInputChange(e)}
              />{" "}
            </Grid>{" "}
            <Grid item xs={12}>
              <TextField
                name="arid"
                label="AR ID"
                fullWidth
                value={arid}
                // onChange={handleChange}
                onChange={(e) => handleInputChange(e)}
                disabled
              />{" "}
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
            <Grid item sx={{ display: "flex", justifyContent: "center" }}>
              <Button variant="contained" color="primary" type="submit">
                Update{" "}
              </Button>{" "}
            </Grid>{" "}
          </Grid>{" "}
        </form>{" "}
      </div>{" "}
    </>
  );
}

export default Update_Poi;
