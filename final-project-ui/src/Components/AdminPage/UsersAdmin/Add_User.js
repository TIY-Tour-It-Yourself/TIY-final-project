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

function Add_User(props) {
  const [fname, setFname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [is_accessible, setIsAccessible] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const { onCancel } = props;

  const handleSubmit = async (e) => {
    e.preventDefault();

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
          setIsFormValid(true);
          if (response.status === 200) {
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

      // Close the modal
      onCancel();

      // Refresh the page
      window.location.reload();
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
      <div style={{ height: "100%", marginBottom: "40px" }}>
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
                onChange={(e) => handleInputChange(e)}
                required
              />
            </Grid>{" "}
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email"
                fullWidth
                value={email}
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
