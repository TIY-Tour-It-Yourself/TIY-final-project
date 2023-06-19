import React, { useState, useEffect } from "react";
import styles from "./Admin.module.css";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import NavBar from "../Additionals/NavBar/NavBar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Container from "@mui/material/Container";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate, useLocation } from "react-router-dom";

const Admin = () => {
  const [token, setToken] = useState("");
  const [activeImage, setActiveImage] = useState(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!location.state) {
      navigate("/");
    } else {
      axios
        .get(`https://tiys.herokuapp.com/api/auth`, {
          headers: {
            "x-auth-token": location.state.token,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setToken(response.data.token);
          // console.log(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user: ", error);
        });
    }
  }, [location.state]);

  const handleNavigatePoisTable = () => {
    navigate("/pois_table", { state: { token: location.state.token } });
  };

  const handleNavigateRoutesTable = () => {
    navigate("/route_table", { state: { token: location.state.token } });
  };
  const handleNavigateUsersTable = () => {
    navigate("/users_table", { state: { token: location.state.token } });
  };

  return (
    <>
      <NavBar token={token} />
      <Typography
        component="div"
        className={styles.title}
        sx={
          !isSmallScreen
            ? {
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                mt: "5%",
                textAlign: "center",
              }
            : { fontSize: "50px", textAlign: "center" }
        }
      >
        <h1>What Would You Like To Do?</h1>
      </Typography>
      <Container
        sx={{
          display: "flex",
          flexWrap: "wrap",
          mt: 2,
          justifyContent: "space-evenly",
        }}
      >
        <Card className={styles.card} sx={{ width: 240 }}>
          {/* <CardMedia
            component="img"
            height="100"
            // image={bursa}
            alt="National Park"
          /> */}
          <CardContent>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Typography variant="h6" component="div">
                POIs(point of interest)
              </Typography>
            </div>
          </CardContent>
          <CardActions>
            <Box sx={{ m: "0 auto" }}>
              <Button
                onClick={handleNavigatePoisTable}
                size="small"
                style={
                  isSmallScreen
                    ? { fontWeight: "bold" }
                    : { fontWeight: "bold", fontSize: "1rem" }
                }
              >
                Enter
              </Button>
            </Box>
          </CardActions>
        </Card>
        <Card className={styles.card} sx={{ width: 240 }}>
          {/* <CardMedia
            component="img"
            height="100"
            // image={map}
            alt="National Park"
          /> */}
          <CardContent>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Typography variant="h6" component="div">
                Routes{" "}
              </Typography>
            </div>
          </CardContent>
          <CardActions>
            <Box sx={{ m: "0 auto" }}>
              <Button
                onClick={handleNavigateRoutesTable}
                size="small"
                style={
                  isSmallScreen
                    ? { fontWeight: "bold" }
                    : { fontWeight: "bold", fontSize: "1rem" }
                }
              >
                Enter
              </Button>
            </Box>
          </CardActions>
        </Card>
        <Card className={styles.card} sx={{ width: 240 }}>
          {/* <CardMedia
            component="img"
            height="100"
            // image={map}
            alt="National Park"
          /> */}
          <CardContent>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Typography variant="h6" component="div">
                Users{" "}
              </Typography>
            </div>
          </CardContent>
          <CardActions>
            <Box sx={{ m: "0 auto" }}>
              <Button
                onClick={handleNavigateUsersTable}
                size="small"
                style={
                  isSmallScreen
                    ? { fontWeight: "bold" }
                    : { fontWeight: "bold", fontSize: "1rem" }
                }
              >
                Enter
              </Button>
            </Box>
          </CardActions>
        </Card>
      </Container>
    </>
  );
};

export default Admin;
