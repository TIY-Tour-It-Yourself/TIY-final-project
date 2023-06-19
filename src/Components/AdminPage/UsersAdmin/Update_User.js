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

function Update_User(props) {
  const { selectedUser, onCancel } = props;
  const location = useLocation();
  const navigate = useNavigate();

  const [fname, setFname] = useState(selectedUser.fname);
  const [email, setEmail] = useState(selectedUser.email);
  const [password, setPassword] = useState("");
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

    if (fname && password) {
      try {
        const response = await axios.put(
          "https://tiys.herokuapp.com/api/users",
          {
            fname,
            email,
            password,
          }
        );

        // const token = response.data.token;
        setIsFormValid(true);

        if (response.status === 200) {
          console.log("OK");
        } else {
          console.log("Status is not 200");
        }
        // Close the modal
        onCancel();

        // Refresh the page
        window.location.reload();
      } catch (err) {
        console.log(err.response.data.errors[0]);

        if (err.response.data.errors[0].msg === "User already exists") {
          alert("Email already exists.");
        } else {
          alert("Invalid Credentials.");
        }
      }
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
  };

  return (
    <>
      {/* <NavBar activeImage={activeImage} /> */}{" "}
      <div style={{ height: "100%", marginBottom: "40px" }}>
        <h2> Update User: </h2>{" "}
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

export default Update_User;
