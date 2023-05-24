import React, { useEffect } from "react";
import styles from "./Researcher.module.css";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useLocation, useNavigate } from "react-router-dom";
import consumer from "./card_images/consumer.jpg";
import producer from "./card_images/producer.jpg";
import { Typography, Container } from "@mui/material";
import NavBar from "../Additionals/NavBar/NavBar";

const cards = [
  { id: 1, title: "Tours Statistics", src: consumer, url: "/tours_table" },
  { id: 2, title: "Locations Statistics", src: producer, url: "/pois_table" },
  // { id: 3, title: 'My Tours', src: '', url: '/tours_history' },
];

const Researcher = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

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
          //    console.log(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user: ", error);
        });
    }
  }, []);

  const handleNavigation = (title) => {
    if (title === "Tours Statistics")
      navigate("/tours_table", { state: { token: location.state.token } });
    if (title === "Locations Statistics")
      navigate("/pois_table", { state: { token: location.state.token } });
  };

  return (
    <>
      <Typography
        component="div"
        sx={
          !isSmallScreen
            ? { mt: "10%", ml: "3%", fontSize: "1.2rem" }
            : { textAlign: "center", mt: "15%", fontSize: "1.12rem" }
        }
      >
        <h2>Researcher Dashboard</h2>
      </Typography>
      <Container
        sx={{
          marginTop: "80px",
          display: "flex",
          flexWrap: "wrap",
          mt: 0,
          mb: 8,
          justifyContent: "space-evenly",
        }}
      >
        {cards.map((card) => (
          <div key={card.id}>
            <p className={styles.box_title}>{card.title}</p>
            <div className={styles.card}>
              <a onClick={() => handleNavigation(card.title)}>
                <img
                  style={{ cursor: "pointer", borderRadius: "25px" }}
                  src={card.src}
                />
              </a>
            </div>
          </div>
        ))}
      </Container>
    </>
  );
};

export default Researcher;
