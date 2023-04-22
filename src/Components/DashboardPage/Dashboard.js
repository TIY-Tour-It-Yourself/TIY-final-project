import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import NavBar from "../Additionals/NavBar/NavBar";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Container from "@mui/material/Container";
import bursa from "./card_images/bursa.jpg";
import map from "../Additionals/Assets/map_cropped.jpg";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate, useLocation } from "react-router-dom";

const cards = [
  { id: 1, title: "Choose Your Tour", src: bursa, url: "/form_consumer" },
  { id: 2, title: "Build Your Tour", src: map, url: "/form_producer" },
  // { id: 3, title: 'My Tours', src: '', url: '/tours_history' },
];

const Dashboard = () => {
  const [token, setToken] = useState("");
  const [activeImage, setActiveImage] = useState(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log(location);
    if (!location.state) {
      navigate("/");
    } else {
      setActiveImage(1);
      axios
        .get(`https://tiys.herokuapp.com/api/auth`, {
          headers: {
            "x-auth-token": location.state.token,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          // console.log(response.data);   //user's data
        })
        .catch((error) => {
          console.error("Error fetching user: ", error);
        });
    }
  }, [location.state]);

  const handleNavigation = (title) => {
    if (title === "Choose Your Tour")
      navigate("/form_consumer", { state: { token: location.state.token } });
    if (title === "Build Your Tour")
      navigate("/form_producer", { state: { token: location.state.token } });
    if (title === "Tours History")
      navigate("/tours_history", { state: { token: location.state.token } });
  };

  return (
    <>
      <NavBar activeImage={activeImage} />
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
          marginTop: "80px",
          display: "flex",
          flexWrap: "wrap",
          mt: 1,
          mb: 8,
          justifyContent: "space-evenly",
        }}
      >
        {cards.map((card) => (
          <Card
            className={styles.card}
            key={card.id}
            sx={{ width: 220, borderRadius: "25px" }}
          >
            <CardMedia
              component="img"
              sx={{ height: 100 }}
              image={card.src}
              alt={card.title}
            />
            <CardContent>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Typography variant="h6" component="div">
                  {card.title}
                </Typography>
              </div>
            </CardContent>
            <CardActions>
              <Box sx={{ m: "0 auto" }}>
                <Button
                  onClick={() => handleNavigation(card.title)}
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
        ))}
      </Container>
    </>
  );
};

export default Dashboard;
