import React, { useState, useEffect } from "react";
import styles from "./Admin.module.css";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import NavBarExternal from "../Additionals/NavBarExternal/NavBarExternal";
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
  const [activeImage, setActiveImage] = useState(null);
  const [admin, setAdmin] = useState("admin");
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!location.state) {
      navigate("/");
    } else {
      setActiveImage(1);
      const fetchUser = async () => {
        try {
          const response = axios.get(`https://tiys.herokuapp.com/api/auth`, {
            headers: {
              "x-auth-token": location.state.token,
              "Content-Type": "application/json",
            },
          });
        } catch (error) {
          console.error("Error fetching user: ", error);
        }
      };
      fetchUser();
    }
  }, [location.state]);

  const handleNavigatePoisTable = () => {
    navigate("/pois_table", {
      state: { token: location.state.token, userRole: admin },
    });
  };

  const handleNavigateRoutesTable = () => {
    navigate("/route_table", {
      state: { token: location.state.token, userRole: admin },
    });
  };
  const handleNavigateUsersTable = () => {
    navigate("/users_table", {
      state: { token: location.state.token, userRole: admin },
    });
  };

  return (
    <>
      <NavBarExternal activeImage={activeImage} userRole={admin} />
      <Typography
        component="div"
        sx={
          !isSmallScreen
            ? {
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                mt: "5%",
                textAlign: "center",
              }
            : {
                marginTop: "10px",
                fontSize: "0.8rem",
                textAlign: "center",
              }
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
          <CardContent>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Typography
                variant="h6"
                component="div"
                sx={{ textAlign: "center" }}
              >
                POIs
                <br />
                (Points Of Interest)
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
