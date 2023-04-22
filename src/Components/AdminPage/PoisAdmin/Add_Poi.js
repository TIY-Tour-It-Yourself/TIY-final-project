import * as React from "react";
import { TextField, Button, Grid } from "@mui/material";

function Add_Poi(props) {
  const selectedPoi = props.selectedPoi;
  console.log(selectedPoi);
  const [formData, setFormData] = React.useState({
    poiid: "",
    name: "",
    description: "",
    address: "",
    coordinates: { lat: "", lng: "" },
    arid: "",
    theme: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

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
    <div>
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
            <TextField
              name="theme"
              label="Theme"
              fullWidth
              value={formData.theme}
              onChange={handleChange}
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

export default Add_Poi;
