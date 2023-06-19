import React, { useEffect } from "react";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useLocation, useNavigate } from "react-router-dom";
import ToursTable from "./ToursTablePage/ToursTable";

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
  };

  return <ToursTable />;
};

export default Researcher;
