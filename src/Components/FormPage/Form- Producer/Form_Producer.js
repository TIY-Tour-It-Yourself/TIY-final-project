import React, { useState, useEffect } from "react";
import styles from "./Form_Producer.module.css";
import axios from "axios";
import { Button, Typography, Box, Grid } from "@mui/material";
import NavBar from "../../Additionals/NavBar/NavBar";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import ARFirstLevel from "./ar_imgs/boy_with_mobile_level_2.jpg";
import ARSecondLevel from "./ar_imgs/ar_img_1.jpg";
import Bialik from "./routes_imgs/tour_bialik.jpg";
import Location from "./routes_imgs/pin_red.png";

const arImgs = [
  { id: 1, name: "Intermediate", src: ARFirstLevel },
  { id: 2, name: "Advanced", src: ARSecondLevel },
];

const Form_Producer = () => {
  const [formTheme, setFormTheme] = useState("");
  const [themeSelectedId, setThemeSelectedId] = useState("");
  const [selectedLevelId, setSelectedLevelId] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [routeChosen, setRouteChosen] = useState("");
  const [routes, setRoutes] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  //POIs' states
  const [poi1, setPoi1] = useState("");
  const [poi2, setPoi2] = useState("");
  const [poi3, setPoi3] = useState("");
  const [poi4, setPoi4] = useState("");
  const [coordinates, setCoordinates] = useState([]);
  const [selectedPOIs, setSelectedPOIs] = useState("");

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const navigate = useNavigate();

  const setSelectedTheme = (value) => {
    if (themeSelectedId !== "") {
      setThemeSelectedId(value);
      // themeSelected.backgroundColor = '#BAD7E9';
    } else {
      setThemeSelectedId(value);
    }
  };

  const handleARExperience = (arId) => {
    setSelectedLevelId(arId);
  };

  //Get Themes from DB
  useEffect(() => {
    axios
      .get("https://tiys.herokuapp.com/api/themes")
      .then((response) => {
        setFormTheme(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  //Get all POIs
  useEffect(() => {
    axios
      .get("https://tiys.herokuapp.com/api/pois")
      .then((response) => {
        setCoordinates(response.data);
      })
      .catch((error) => {
        console.error("Error fetching POIs: ", error);
      });
  }, []);

  //Get POIS from DB
  useEffect(() => {
    const filterData = async () => {
      try {
        // Make an API request to fetch the routes data
        const response = await axios.get("https://tiys.herokuapp.com/api/pois");
        setCoordinates(response.data);
        // console.log(response.data);

        // Check if both Theme and ARlevel have been selected
        if (themeSelectedId && selectedLevelId) {
          // Filter the data based on the selected values
          const filtered = response.data.filter((coordinate) => {
            return (
              coordinate.theme.themeid === themeSelectedId &&
              coordinate.arid.level === selectedLevelId
            );
          });

          // Update the state with the filtered data
          setFilteredData(filtered);
          console.log(`filtered: ${filtered.length}`);
        } else {
          // If either theme or level is not selected, set filtered data to null
          setFilteredData(null);
        }
      } catch (error) {
        console.log(error);
      }
    };

    filterData();
  }, [themeSelectedId, selectedLevelId]);

  //While data hasn't become an array yet- keep loading
  if (!Array.isArray(formTheme) || !Array.isArray(coordinates)) {
    return <div> Loading... </div>;
  }

  const handleBuildTour = (event) => {
    event.preventDefault();
    const selectedValues = {
      poi1: JSON.parse(poi1),
      poi2: JSON.parse(poi2),
      poi3: JSON.parse(poi3),
      poi4: JSON.parse(poi4),
    };
    navigate("/map_producer", { state: { selectedValues, coordinates } });
  };

  //Update array according to filter and selection
  const handlePOISelection = (poi) => {
    // console.log(poi);
    //Check if POI is already selected
    const poiIndex = selectedPOIs.indexOf(poi);
    if (poiIndex === -1) {
      //POI not already selected- add to array
      setSelectedPOIs([...selectedPOIs, poi]);
      console.log(`line 130: ${selectedPOIs}`);
    } else {
      console.log(`removed ${selectedPOIs}`);
      //POI already selected- remove from array
      const updatedPOIs = [...selectedPOIs];
      updatedPOIs.splice(poiIndex, 1);
      setSelectedPOIs(updatedPOIs);
    }
  };
  const poiid = selectedPOIs ? selectedPOIs.map((item) => item.poiid) : [];
  console.log("line 146 :", poiid);

  // Convert poiid array to an object with numbered keys
  const poiidMap = poiid.reduce((accumulator, current, i) => {
    accumulator[`poi${i + 1}`] = current;
    return accumulator;
  }, {});

  // console.log("line 145 :", poiid[0]);

  // let coordinate = [];
  // if (selectedPOIs) {
  //   for (let i = 0; i < selectedPOIs.length; i++) {
  //     coordinate.push(selectedPOIs[i].coordinates);
  //   }
  // }

  // for (let i = 0; i < coordinate.length; i++) {
  //   console.log("POI " + (i + 1) + " latitude: " + coordinate[i].lat);
  // }

  return (
    <>
      <NavBar />
      <Typography component="div" className={styles.title}>
        <h1 style={!isSmallScreen ? {} : { fontSize: "25px" }}>
          Build Your Tour{" "}
        </h1>{" "}
      </Typography>{" "}
      <Box component="div" className={styles.theme_div}>
        <Typography
          sx={
            isSmallScreen
              ? { fontSize: "1rem", marginLeft: "18%" }
              : { fontSize: "1.25rem" }
          }
        >
          <b> Choose Tour Theme: </b>{" "}
        </Typography>{" "}
        {/* Render themes through map */}{" "}
        <Box
          component="div"
          className={styles.themes}
          sx={
            isSmallScreen
              ? {
                  display: "flex",
                  flexWrap: "wrap",
                  maxWidth: "90%",
                  padding: "3px",
                  marginTop: "2px",
                  justifyContent: "center",
                }
              : {
                  maxWidth: "max-content",
                }
          }
        >
          {" "}
          {formTheme.map((theme) => (
            <Button
              key={theme.themeid}
              onClick={() => setSelectedTheme(theme.themeid)}
              value={theme}
              variant={
                themeSelectedId === theme.themeid ? "contained" : "outlined"
              }
              sx={
                !isSmallScreen
                  ? {
                      borderRadius: "20px",
                      height: "30px",
                      marginLeft: 1,
                      marginTop: 2,
                    }
                  : {
                      marginLeft: 1.5,
                      marginBottom: 1,
                      height: "30px",
                      borderRadius: "20px",
                    }
              }
            >
              {" "}
              {theme.theme}{" "}
            </Button>
          ))}{" "}
        </Box>{" "}
      </Box>{" "}
      <Box component="div" className={styles.AR_exp_div}>
        <Typography
          sx={
            isSmallScreen
              ? { fontSize: "1rem", ml: 1, mt: 2 }
              : { fontSize: "1.25rem", mt: 2 }
          }
        >
          <b> Choose AR Experience: </b>{" "}
        </Typography>{" "}
        <div className={styles.ar_imgs}>
          {" "}
          {arImgs.map((arImg) => (
            <div key={arImg.id}>
              <img
                value={arImg}
                src={arImg.src}
                style={{
                  border:
                    selectedLevelId === arImg.id
                      ? "2px solid rgb(83, 125, 203)"
                      : "1px dashed rgb(83, 125, 203)",
                }}
                onClick={() => handleARExperience(arImg.id)}
                alt={arImg.name}
                width="150"
                height="150"
              />
              <div className={styles.arlevel_name}>
                <span> {arImg.name} </span>{" "}
              </div>{" "}
            </div>
          ))}{" "}
        </div>{" "}
      </Box>{" "}
      {/* Routes List */}{" "}
      <Box>
        <div className={styles.pois_title}>
          <Typography
            component="h3"
            sx={isSmallScreen ? { fontSize: "1rem" } : { fontSize: "1.25rem" }}
          >
            <b> Choose the POIs you want to visit: </b>{" "}
          </Typography>{" "}
        </div>{" "}
      </Box>{" "}
      {selectedPOIs.length >= 4 && (
        <div
          style={{ textAlign: "center", marginTop: "5px", marginRight: "6px" }}
        >
          <Button
            sx={
              !isSmallScreen
                ? {
                    width: "120px",
                    borderRadius: "20px",
                    height: "30px",
                    marginLeft: 1,
                    marginTop: 2,
                    background: "#C9EEFF",
                    fontSize: "0.75rem",
                  }
                : {
                    marginLeft: 1.5,
                    marginBottom: 1,
                    height: "30px",
                    borderRadius: "20px",
                    background: "#C9EEFF",
                    fontSize: "0.75rem",
                  }
            }
            onClick={
              () =>
                navigate(
                  `/map_producer?${Object.entries(poiidMap)
                    .map(([key, value]) => `${key}=${value}`)
                    .join("&")}`
                )
              // {
              //   navigate(`/map_producer`);
              // }
            }
          >
            Build Tour{" "}
          </Button>{" "}
        </div>
      )}{" "}
      {!filteredData ? (
        <div className={styles.poi_imgs}>
          {coordinates.map((poi) => (
            <div
              style={{ cursor: "pointer", position: "relative" }}
              key={poi.poiid}
              value={JSON.stringify(poi.coordinates)}
              onClick={() => handlePOISelection(poi)}
            >
              <img src={Location} alt={poi.name} />{" "}
              <Typography
                component="p"
                sx={
                  !isSmallScreen
                    ? {
                        fontStyle: "italic",
                        fontSize: "0.9rem",
                        ml: 1.5,
                      }
                    : { fontSize: "0.8rem", fontStyle: "italic" }
                }
              >
                {" "}
                {poi.name}{" "}
              </Typography>{" "}
            </div>
          ))}{" "}
        </div>
      ) : (
        <div className={styles.poi_imgs}>
          {" "}
          {filteredData.map((poi) => (
            <div
              style={{ cursor: "pointer", position: "relative" }}
              key={poi.poiid}
              value={JSON.stringify(poi.coordinates)}
              onClick={() => handlePOISelection(poi)}
            >
              <img src={Location} alt={poi.name} />{" "}
              <Typography
                component="p"
                sx={
                  !isSmallScreen
                    ? {
                        fontStyle: "italic",
                        fontSize: "0.9rem",
                        ml: 1.5,
                      }
                    : { fontSize: "0.8rem", fontStyle: "italic" }
                }
              >
                {poi.name}{" "}
              </Typography>{" "}
            </div>
          ))}{" "}
        </div>
      )}{" "}
    </>
  );
};

export default Form_Producer;
