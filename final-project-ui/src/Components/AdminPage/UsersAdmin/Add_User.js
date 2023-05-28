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

function Add_User(props) {
  // const selectedPoi = props.selectedPoi;
  const [newPoiId, setNewPoiId] = useState(props.lastRouteId + 1);
  const [themeOptions, setThemeOptions] = useState([]);
  const [activeImage, setActiveImage] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const [fname, setFname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [is_accessible, setIsAccessible] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    //Post request - need to post data to DB to register user
    //If all fields are filled
    if (
      fname.trim().length !== 0 &&
      email.trim().length !== 0 &&
      password.trim().length !== 0 &&
      age.trim().length !== 0 &&
      is_accessible
    ) {
      await axios
        .post(`https://tiys.herokuapp.com/api/users`, {
          fname,
          email,
          password,
          age,
          is_accessible,
        })
        .then((response) => {
          //   const token = response.data.token;
          setIsFormValid(true);
          if (response.status === 200) {
            console.log("OK");
          } else {
            console.log("Status is not 200");
          }
        })
        .catch((err) => {
          console.log(err.response.data.errors[0]);
          if (err.response.data.errors[0].msg === "User already exists") {
            alert("Email already exists.");
          } else {
            alert("Invalid Credentials.");
          }
        });
    } else {
      alert("All fields are required.");
      setIsFormValid(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "fname") {
      setFname(value);
    }

    if (name === "email") {
      setEmail(value);
    }

    if (name === "password") {
      setPassword(value);
    }

    if (name === "age") {
      setAge(value);
    }
  };

  return (
    <>
      {" "}
      {/* <NavBar activeImage={activeImage} /> */}{" "}
      <div style={{ height: "100%" }}>
        <h2> Add New User: </h2>{" "}
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
                name="fname"
                label="Full Name"
                fullWidth
                value={fname}
                error={!isValid && isDirty}
                onBlur={() => setIsDirty(true)}
                // onChange={handleChange}
                onChange={(e) => handleInputChange(e)}
                required
                // disabled
              />{" "}
            </Grid>{" "}
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email"
                fullWidth
                value={email}
                // onChange={handleChange}
                onChange={(e) => handleInputChange(e)}
                required
              />{" "}
            </Grid>{" "}
            <Grid item xs={12}>
              <TextField
                name="password"
                label="Password"
                fullWidth
                value={password}
                // onChange={handleChange}
                onChange={(e) => handleInputChange(e)}
                required
              />{" "}
            </Grid>{" "}
            <Grid item xs={12}>
              <TextField
                name="age"
                label="Age"
                fullWidth
                value={age}
                // onChange={handleChange}
                onChange={(e) => handleInputChange(e)}
                required
              />{" "}
            </Grid>{" "}
            <Grid item xs={6}>
              <InputLabel id="select-label">
                Accessibility Required ?
              </InputLabel>{" "}
              <Select
                sx={{ height: 50 }}
                labelId="demo-simple-select-label"
                id="is_accessible"
                value={is_accessible}
                label="Is Accessible"
                required
                onChange={(e) => setIsAccessible(e.target.value)}
                // onBlur={() => setIsDirty(true)}
              >
                <MenuItem value={"yes"}> Yes </MenuItem>{" "}
                <MenuItem value={"no"}> No </MenuItem>{" "}
              </Select>{" "}
            </Grid>{" "}
            <Grid item sx={{ display: "flex", justifyContent: "center" }}>
              <Button variant="contained" color="primary" type="submit">
                Submit{" "}
              </Button>{" "}
            </Grid>{" "}
          </Grid>{" "}
        </form>{" "}
      </div>{" "}
    </>
  );
}

export default Add_User;
