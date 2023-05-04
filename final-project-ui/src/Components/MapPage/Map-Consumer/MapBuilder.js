import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  GoogleMap,
  LoadScript,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import axios from "axios";
import arIcon from "./images/ar_icon.png";
import ranking from "./images/star.png";
import styles from "./MapBuilder.module.css";
import { useLocation, useNavigate } from "react-router-dom";
// import ARManagement from "../../ARPage/ARManagement";
import ReviewForm from '../ReviewFormPage/ReviewForm';

const MapBuilder = (props) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isLocationsLoaded, setIsLocationsLoaded] = useState(false);
  const [poisData, setPoisData] = useState([]);
  const [routePois, setRoutePois] = useState([]);
  const [isPoisDataLoaded, setIsPoisDataLoaded] = useState("");
  const [poisLatData, setPoisLatData] = useState([]);
  const [poisLngData, setPoisLngData] = useState([]);
  const [poisCoordinatesData, setPoisCoordinatesData] = useState([]);
  const [isNamesLoaded, setIsNamesLoaded] = useState(false);
  const [isURLsLoaded, setIsURLsLoaded] = useState(false);
  const [locationName, setLocationName] = useState([]);
  const [ARURLArray, setARURLArray] = useState([]);
  const [poisNames, setPoisNames] = useState([]);
  const [poisIdNums, setPoisIdNums] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [poiIdsLoaded, setIsPoiIdsLoaded] = useState(false);
  const [selectedARPoi, setSelectedARPoi] = useState(null);
  const [selectedPoi, setSelectedPoi] = useState(null);
  const [poiIds, setPoiIds] = useState([]);
  const [email, setEmail] = useState("");
  const [grade, setGrade] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [routeDescription, setRouteDescription] = useState("");
  const [theme, setTheme] = useState("");
  const [routeId, setRouteId] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [userposition, setUserPosition] = useState([]);

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
          // console.log(response.data);
          setEmail(response.data.email);
        })
        .catch((error) => {
          console.error("Error fetching user: ", error);
        });
    }
  }, [location.state]);

  useEffect(() => {
    console.log("route chosen");
    const searchParams = new URLSearchParams(location.search);
    const routeChosen = searchParams.get("routeId");
    setRouteId(routeChosen);
    // console.log(routeChosen);
    //Get Route by ID
    const fetchRoute = async () => {
      try {
        const response = await axios.get(
          `https://tiys.herokuapp.com/api/routes/${routeChosen}`
        );
        //Get route pois
        const pois = response.data[0].pois;
        setExperienceLevel(response.data[0].experience_level);
        setRouteDescription(response.data[0].description);
        setGrade(response.data[0].evaluation_grade);
        setTheme(response.data[0].theme.theme);
        // console.log(response.data);
        // setPoisData(pois);
        const poisIds = pois.map((poi) => poi.poiid);

        //Get all pois' coordinates
        const coordinatesArray = pois.map((poi) => poi.coordinates);
        setPoisCoordinatesData(coordinatesArray);

        let latArray = [];
        let lngArray = [];

        pois.forEach((poi) => {
          latArray.push(poi.coordinates.lat);
          lngArray.push(poi.coordinates.lng);
        });

        setPoisLatData(latArray);
        setPoisLngData(lngArray);
        setPoisNames(pois);
        setPoisIdNums(poisIds);

        // Set the state variable to true when data is loaded
        setIsLocationsLoaded(true);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRoute();
  }, [location.search]);

  // Get POIs from DB
  useEffect(() => {
    console.log("get pois");

    const getPoisData = async () => {
      try {
        const response = await axios.get("https://tiys.herokuapp.com/api/pois");
        setPoisData(response.data);
        setIsPoisDataLoaded(true);
      } catch (error) {
        console.log(error);
      }
    };
    getPoisData();
  }, []);

  useEffect(() => {
    console.log("poisName");

    //Get route pois' names
    const names = poisNames.map((poi) => poi.name);
    setLocationName(names);
    setIsNamesLoaded(true);
  }, [poisNames]);

  useEffect(() => {
    console.log("arUrl");

    const fetchData = async () => {
      try {
        // Get AR element
        const filteredPois = poisData.filter((poi) =>
          poisIdNums.includes(poi.poiid)
        );
        setRoutePois(filteredPois);

        const arURLs = routePois.map((arElement) => arElement.arid.url);

        setARURLArray(arURLs);
        setIsURLsLoaded(true);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [poisData]);

  useEffect(() => {
    // if (
    //   locationName !== undefined &&
    //   routePois !== undefined &&
    //   ARURLArray !== undefined &&
    //   isNamesLoaded &&
    //   isURLsLoaded
    // ) {
    initializeMap();
    console.log("intialized map !");
    // }
  }, [routePois, isNamesLoaded, isURLsLoaded]);

  // ****************************
  // useEffect(() => {
  //   if (poisData && poisData.length > 0) {
  //     const poiIdArray = poisData.map((poi) => poi.poiid);
  //     setPoiIds(poiIdArray);
  //     setIsPoiIdsLoaded(true);
  //   }
  // }, [poisData]);

  //  useEffect(() => {
  // navigate(`http://ar_management.html?lat=${selectedARPoi.coordinates.lat}&lng=${selectedARPoi.coordinates.lng}&desc=${selectedARPoi.description}&img=${selectedARPoi.arid.url}`);
  // openARElement();
  //  }, [selectedARPoi]);
  // *********************************************

  //Open AR Element from ARManagement component
  const openARElement = (poi) => {
    const url = `/ar.html?lat=${poi.coordinates.lat}&lng=${poi.coordinates.lng}&desc=${poi.description}&img=${poi.arid.url}`;
    // const url = `/ar_page?lat=${poi.coordinates.lat}&lng=${poi.coordinates.lng}&desc=${poi.description}&img=${poi.arid.url}`;
    // window.location.href = `/ar.html?lat=${poi.coordinates.lat}&lng=${poi.coordinates.lng}&desc=${poi.description}&img=${poi.arid.url}`;
    window.open(url, "_blank");
  };

  function handleAddReview(poi) {
    setShowForm(true);
    setSelectedPoi(poi.poiid);
  }

  function handleCancel() {
    setShowForm(false);
  }

  const initializeMap = () => {
    navigator.geolocation.getCurrentPosition(function (position) {
      var userPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      if (
        isLocationsLoaded &&
        routePois &&
        poisData &&
        locationName &&
        ARURLArray
      ) {
        const map = new window.google.maps.Map(document.getElementById("map"), {
          center: { lat: poisLatData[0], lng: poisLngData[0] },
          zoom: 12,
        });
        // Create the start navigation button
        const startNavigationButton = document.createElement("button");
        startNavigationButton.textContent = "Start";
        startNavigationButton.style.backgroundColor = "#007aff";
        startNavigationButton.style.color = "white";
        startNavigationButton.style.padding = "10px";
        startNavigationButton.style.borderRadius = "25px"; // change from "50%" to "25px"
        startNavigationButton.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.3)";
        startNavigationButton.style.fontSize = "16px";
        startNavigationButton.style.lineHeight = "1";
        startNavigationButton.style.border = "none";
        startNavigationButton.style.cursor = "pointer";
        startNavigationButton.style.marginLeft = "60px";

        // Create the stop navigation button
        const stopNavigationButton = document.createElement("button");
        stopNavigationButton.textContent = "Stop";
        stopNavigationButton.style.backgroundColor = "#007aff";
        stopNavigationButton.style.color = "white";
        stopNavigationButton.style.padding = "10px";
        stopNavigationButton.style.borderRadius = "25px"; // change from "50%" to "25px"
        stopNavigationButton.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.3)";
        stopNavigationButton.style.fontSize = "16px";
        stopNavigationButton.style.lineHeight = "1";
        stopNavigationButton.style.border = "none";
        stopNavigationButton.style.cursor = "pointer";

        // Create the timer element with white background
        const timerDiv = document.createElement("div");
        timerDiv.innerHTML = "00:00";
        timerDiv.style.backgroundColor = "white";
        timerDiv.style.padding = "5px";
        timerDiv.style.borderRadius = "5px";
        timerDiv.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.3)";
        timerDiv.style.fontSize = "16px";
        timerDiv.style.marginBottom = "30px";

        // Add the timer element to the map controls
        map.controls[window.google.maps.ControlPosition.TOP_CENTER].push(
          timerDiv
        );

        // Add media query to update marginTop if screen width is greater than 400px
        const mediaQuery = window.matchMedia("(min-width: 600px)");

        const handleMediaQuery = (mediaQuery) => {
          if (mediaQuery.matches) {
            timerDiv.style.marginTop = "100px";
          } else {
            timerDiv.style.marginTop = "10px";
          }
        };

        // Call the function once to set the initial marginTop
        handleMediaQuery(mediaQuery);

        // Listen for changes in the media query and update marginTop accordingly
        mediaQuery.addEventListener("change", handleMediaQuery);

        let hours = 0;
        let seconds = 0;
        let minutes = 0;
        let timerInterval;
        let totalTime;

        // Add event listener to the stop navigation button
        stopNavigationButton.addEventListener("click", function () {
          // Stop the timer
          clearInterval(timerInterval);
          totalTime = `${hours}:${minutes}:${seconds}`;
          console.log("Total time:", totalTime);

          // Disable the button
          stopNavigationButton.disabled = true;
          stopNavigationButton.style.backgroundColor = "#EEEEEE";
          stopNavigationButton.style.color = "grey";
          stopNavigationButton.style.cursor = "default";

          // Show the alert message
          alert("Hope you enjoyed your tour!");
          // axios.post("https://tiys.herokuapp.com/api/tours", {
          //   description: routeDescription,
          //   duration: "00:00:00",
          //   email: email,
          //   evaluation_grade: grade,
          //   experience_level: experienceLevel,
          //   routeid: routeId,
          //   theme: theme,
          // });
        });

        let savedRoute;
        let isNavigationStarted = false;

        // Add an event listener to the button to start navigation and the timer
        startNavigationButton.addEventListener("click", function () {
          if (savedRoute) {
            directionsRenderer.setDirections(savedRoute);
          } else {
            directionsService.route(request, function (response, status) {
              if (status == window.google.maps.DirectionsStatus.OK) {
                savedRoute = response;
                directionsRenderer.setDirections(response);
              }
            });
          }

          // Start the timer
          timerInterval = setInterval(function () {
            seconds++;
            if (seconds === 60) {
              seconds = 0;
              minutes++;
            }
            if (minutes === 60) {
              minutes = 0;
              hours++;
            }
            timerDiv.innerHTML = `${hours < 10 ? "0" + hours : hours}:${
              minutes < 10 ? "0" + minutes : minutes
            }:${seconds < 10 ? "0" + seconds : seconds}`;
          }, 1000);

          // Disable the button
          startNavigationButton.disabled = true;
          startNavigationButton.style.backgroundColor = "#EEEEEE";
          startNavigationButton.style.color = "grey";
          startNavigationButton.style.cursor = "default";
          isNavigationStarted = true;

          // axios
          //   .post("/api/navigation", {
          //     time: totalTime,
          //   })
          //   .then(function (response) {
          //     console.log(response.data);
          //   })
          //   .catch(function (error) {
          //     console.log(error);
          //   });
        });

        const resetButton = document.createElement("button");
        resetButton.innerText = "Reset";
        resetButton.style.backgroundColor = "#007aff";
        resetButton.style.color = "white";
        resetButton.style.padding = "10px";
        resetButton.style.borderRadius = "25px"; // change from "50%" to "25px"
        resetButton.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.3)";
        resetButton.style.fontSize = "16px";
        resetButton.style.lineHeight = "1";
        resetButton.style.border = "none";
        resetButton.style.cursor = "pointer";

        resetButton.addEventListener("click", () => {
          directionsService.route(request, function (response, status) {
            if (status == window.google.maps.DirectionsStatus.OK) {
              directionsRenderer.setDirections(response);
              updateDurationDiv();
            } else {
              console.log("Directions request failed: " + status);
            }
          });
        });

        const directionsService = new window.google.maps.DirectionsService();
        const directionsRenderer = new window.google.maps.DirectionsRenderer({
          map: map,
          draggable: true,
          suppressMarkers: true,
        });

        const origin = userPosition;
        const destination = new window.google.maps.LatLng(
          poisLatData[poisLatData.length - 1],
          poisLngData[poisLatData.length - 1]
        );

        const waypoints = [];
        for (let i = 0; i < poisLatData.length; i++) {
          waypoints.push({
            location: new window.google.maps.LatLng(
              poisLatData[i],
              poisLngData[i]
            ),
            stopover: true,
          });
        }

        const request = {
          origin: origin,
          destination: destination,
          waypoints: waypoints,
          travelMode: window.google.maps.TravelMode.WALKING,
          language: "en",
        };

        // Create the duration element with white background
        const durationDiv = document.createElement("div");
        durationDiv.style.backgroundColor = "white";
        durationDiv.style.padding = "5px";
        durationDiv.style.borderRadius = "5px";
        durationDiv.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.3)";
        durationDiv.style.fontSize = "16px";
        durationDiv.style.marginBottom = "60px";

        // Add the duration element to the map controls
        map.controls[window.google.maps.ControlPosition.BOTTOM_CENTER].push(
          durationDiv
        );

        const updateDurationDiv = () => {
          const response = directionsRenderer.getDirections();
          const durationInSeconds = response.routes[0].legs.reduce(
            (total, leg) => total + leg.duration.value,
            0
          );

          let durationString = "";

          const durationInMinutes = Math.round(durationInSeconds / 60);
          if (durationInMinutes >= 60) {
            const hours = Math.floor(durationInMinutes / 60);
            const remainingMinutes = durationInMinutes % 60;
            durationString = `${hours}h`;

            if (remainingMinutes > 0) {
              durationString += ` ${remainingMinutes}m`;
            }
          } else {
            durationString = `${durationInMinutes}m`;
          }

          const eta = new Date(Date.now() + durationInSeconds * 1000);

          const distanceInMeters = response.routes[0].legs.reduce(
            (total, leg) => total + leg.distance.value,
            0
          );
          const distanceInKilometers = (distanceInMeters / 1000).toFixed(1);

          // Append the buttons to the durationDiv
          durationDiv.innerHTML = `<b>Walking duration:</b> ${durationString}<br><b>Distance:</b> ${distanceInKilometers} km<br><b>ETA:</b> ${eta.toLocaleTimeString(
            [],
            {
              hour: "numeric",
              minute: "numeric",
            }
          )}`;
          durationDiv.appendChild(startNavigationButton);
          durationDiv.appendChild(stopNavigationButton);
          durationDiv.appendChild(resetButton);
        };

        // Arrow location marker
        directionsService.route(request, function (response, status) {
          console.log("route created");
          if (status == window.google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(response);
            updateDurationDiv();

            // Get the first step in the route
            let nextStep = response.routes[0].legs[0].steps[0];

            // Create an arrow marker that points in the direction of the next step
            const arrowMarker = new window.google.maps.Marker({
              position: userPosition,
              icon: {
                path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                strokeColor: "#1C6758",
                fillColor: "#03C988",
                fillOpacity: 1,
                scale: 4,
              },
              map,
            });

            // Update the arrow marker whenever the user's location changes
            // Get the bearing of a line between two points
            function getBearing(from, to) {
              const lat1 = from.lat();
              const lng1 = from.lng();
              const lat2 = to.lat();
              const lng2 = to.lng();
              const y = Math.sin(lng2 - lng1) * Math.cos(lat2);
              const x =
                Math.cos(lat1) * Math.sin(lat2) -
                Math.sin(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1);
              const bearing = (Math.atan2(y, x) * 180) / Math.PI;
              return bearing;
            }

            // Calculate the difference between two angles in degrees
            function getAngleDiff(a, b) {
              const diff = Math.abs(a - b) % 360;
              const angle = diff > 180 ? 360 - diff : diff;
              return angle;
            }

            // Update the arrow marker whenever the user's location changes
            navigator.geolocation.watchPosition(
              (position) => {
                const userLocation = new window.google.maps.LatLng(
                  position.coords.latitude,
                  position.coords.longitude
                );

                // Check if the user has reached the end of the current step
                if (
                  window.google.maps.geometry.spherical.computeDistanceBetween(
                    userLocation,
                    nextStep.end_location
                  ) < 5
                ) {
                  // Move to the next step in the route
                  nextStep = response.routes[0].legs[0].steps.find((step) => {
                    return (
                      window.google.maps.geometry.spherical.computeDistanceBetween(
                        userLocation,
                        step.start_location
                      ) < 5
                    );
                  });

                  // Rotate the symbol to point in the direction of the next step
                  const bearing = getBearing(
                    nextStep.start_location,
                    nextStep.end_location
                  );
                  const angleDiff = getAngleDiff(
                    position.coords.heading,
                    bearing
                  );
                  if (angleDiff > 45) {
                    arrowMarker.setIcon(
                      Object.assign({}, arrowMarker.getIcon(), {
                        rotation: bearing,
                      })
                    );
                  }
                }

                // Rotate the symbol to point in the direction of the next step
                arrowMarker.setIcon(
                  Object.assign({}, arrowMarker.getIcon(), {
                    rotation:
                      window.google.maps.geometry.spherical.computeHeading(
                        userLocation,
                        nextStep.end_location
                      ) - position.coords.heading,
                  })
                );

                // Move the arrow marker to the new location and center the map
                arrowMarker.setPosition(userLocation);
                map.setCenter(userLocation);
              },
              (error) => {
                console.log(error);
              },
              {
                enableHighAccuracy: true,
                maximumAge: 10000,
              }
            );
          } else {
            console.log("Directions request failed: " + status);
          }
        });

        window.google.maps.event.addListener(
          directionsRenderer,
          "directions_changed",
          function () {
            savedRoute = directionsRenderer.getDirections();
            updateDurationDiv();
            // updateDirectionsDiv(savedRoute, userPosition);
          }
        );

        // Create a Marker object for each poi and add an info window
        routePois.forEach((poi, index) => {
          const marker = new window.google.maps.Marker({
            position: { lat: poi.coordinates.lat, lng: poi.coordinates.lng },
            map: map,
          });
          console.log(
            `Marker created at (${poi.coordinates.lat}, ${poi.coordinates.lng})`
          );

          // <button id="open-ar-element" style="border: none; background-color: transparent;">
          //    <img src="${arIcon}" width='40px' height='40px' alt='${locationName[index]}'>
          //    <br/>
          //    <span style="text-decoration: none; font-size: small;">Click Me</span>
          // </button>
          const infoWindow = new window.google.maps.InfoWindow({
            content: `<div style="display: flex; justify-content: center; flex-direction: column; margin-left: 22px;">
                  <div style="margin: 0 auto;"><h4>${locationName[index]}</h4></div>
                  <div style="display: flex; margin-left: 15px; justify-content: center;">
                  <div style="display: flex; flex-direction: column; align-items: center; margin-right: 10px;">
                    <a href="${ARURLArray[index]}" target="_blank" style="text-decoration: none;">
                      <div>
                        <img src="${arIcon}" width='40px' height='40px' alt='${locationName[index]}'>
                      </div>
                      <div style="margin-top: 7px;">
                        <span style="text-decoration: none; font-size: small;">Click Me</span>
                      </div>
                    </a> 
                  </div>
                  <div style="display: flex; flex-direction: column; align-items: center;">
                    <button id="add-review-button" style="border: none; background-color: transparent;">
                      <img src=${ranking} width='40px' height='40px' alt="Add Review" />
                      <div style="margin-top: 5px;">
                        <span style="text-decoration: none; font-size: small;">Rank Me</span>
                      </div>
                    </button>  
                  </div>
                </div>
               </div>`,
          });

          infoWindow.addListener("domready", () => {
            //Open Review Form
            const addButton = document.querySelector("#add-review-button");
            addButton.addEventListener("click", () => {
              handleAddReview(poi);
            });

            //Open AR Element
            // const addARButton = document.querySelector("#open-ar-element");
            // addARButton.addEventListener("click", () => {
            //   openARElement(poi);
            // });
          });

          marker.addListener("click", () => {
            infoWindow.open(map, marker); // open the info window when the marker is clicked
          });
        });
      }
    });
  };

  return (
    <div id="map" style={{ height: "100vh", width: "100%" }}>
      {/* {isMapLoaded && <LoadScript />} */}
      {window.google === undefined ? (
        <LoadScript>
          <GoogleMap />
        </LoadScript>
      ) : (
        <GoogleMap />
      )}
      {showForm && (
        <div className="lightbox">
          <div className="lightbox-content">
            <button className="close-btn" onClick={handleCancel}>
              X
            </button>
            <ReviewForm
              showForm={showForm}
              onCancel={handleCancel}
              poiValues={selectedPoi}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MapBuilder;
