import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import axios from "axios";
import arIcon from "./images/ar_icon1.png";
import ranking from "./images/star.png";
import { useLocation } from "react-router-dom";
import NavBar from "../../Additionals/NavBar/NavBar";

const BiyalikMap = (props) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isLocationsLoaded, setIsLocationsLoaded] = useState(false);
  const [poisData, setPoisData] = useState([]);
  const [isPoisDataLoaded, setIsPoisDataLoaded] = useState("");
  const [poisLatData, setPoisLatData] = useState([]);
  const [poisLngData, setPoisLngData] = useState([]);
  const [themeSelectedId, setThemeSelectedId] = useState("");
  const [selectedLevelId, setSelectedLevelId] = useState("");
  const [poisCoordinatesData, setPoisCoordinatesData] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isNamesLoaded, setIsNamesLoaded] = useState(false);

  const [locationName, setLocationName] = useState([]);
  const [ARURLArray, setARURLArray] = useState([]);

  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const routeChosen = searchParams.get("routeChosen");

    //Get Route by ID
    const fetchRoute = async () => {
      try {
        const response = await axios.get(
          `https://tiys.herokuapp.com/api/routes`
        );

        //Get route pois
        const pois = response.data[0].pois;

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

        // Set the state variable to true when data is loaded
        setIsLocationsLoaded(true);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRoute();
  }, [location.search]);

  useEffect(() => {
    if (
      poisLatData.length > 0 &&
      poisLngData.length > 0 &&
      poisCoordinatesData > 0
    ) {
      console.log(poisLatData, poisLngData);
      console.log(poisCoordinatesData);
    }
  }, [poisLatData, poisLngData, poisCoordinatesData]);
  //Get POIs from DB
  useEffect(() => {
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

  let locations;
  //While data hasn't become an array yet- keep loading
  if (!Array.isArray(poisData)) {
    return <div> Loading... </div>;
  }
  // getlocations
  locations = poisData.map((item) => item.coordinates);
  // Get the location names
  useEffect(() => {
    const names = poisData.map((item) => item.name);
    setLocationName(names);
    setIsNamesLoaded(true);
  }, [poisData, setLocationName]);

  useEffect(() => {
    if (locationName !== undefined) {
      initializeMap();
    }
  }, [locationName]);

  // getAREelement
  useEffect(() => {
    const urls = poisData.map((item) => item.arid.url);
    setARURLArray(urls);
  }, [poisData, setARURLArray]);

  useEffect(() => {
    if (ARURLArray !== undefined) {
      initializeMap();
    }
  }, [ARURLArray]);

  const initializeMap = () => {
    // Check if locations data is loaded and available
    if (isLocationsLoaded && poisCoordinatesData && poisData !== undefined) {
      // console.log(isLocationsLoaded, JSON.stringify(poisCoordinatesData), JSON.stringify(poisData));
      // Create a map object and center it on the first location
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: poisLatData[0], lng: poisLngData[0] },
        zoom: 12,
      });
      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: true, // add this line to suppress markers
      });
      const origin = new window.google.maps.LatLng(
        poisLatData[0],
        poisLngData[0]
      );
      const destination = new window.google.maps.LatLng(
        poisLatData[poisLatData.length - 1],
        poisLngData[poisLatData.length - 1]
      );

      const request = {
        origin: origin,
        destination: destination,
        waypoints: [
          {
            location: new window.google.maps.LatLng(
              poisLatData[1],
              poisLngData[1]
            ),
            stopover: true,
          },
          {
            location: new window.google.maps.LatLng(
              poisLatData[2],
              poisLngData[2]
            ),
            stopover: true,
          },
        ],
        travelMode: window.google.maps.TravelMode.WALKING,
      };

      directionsService.route(request, function (response, status) {
        if (status == window.google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(response);
        }
      });

      // Create a Marker object for each poi and add an info window
      poisCoordinatesData.forEach((poi, index) => {
        const marker = new window.google.maps.Marker({
          position: { lat: poi.lat, lng: poi.lng },
          map: map,
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div style="display: flex; justify-content: center; flex-direction: column;">
                           <div style="margin-left: 10px;"><h4>${locationName[index]}</h4></div>
                           <div style="display: flex; justify-content: center; flex-direction: row; margin-left: 5px;">
                           <div style={{backgroundColor: 'transparent', textAlign: 'center'}}>
                                 <a href="${ARURLArray[index]}" target="_blank">
                              <img src="${arIcon}" width='40px' height='40px' alt='${locationName[index]}'>
                              </a>
                           </div>
                           <div>
                           <a href="#" style="text-decoration: none;">
                              <img src=${ranking} style="padding: 7px;" width='25px' height='25px' alt='rankPoi'/>
                              </a>
                           </div>
                           </div>
                        </div>`,
        });
        marker.addListener("click", () => {
          infoWindow.open(map, marker); // open the info window when the marker is clicked
        });
      });

      // Create a Marker object for the current user location
      let userLocationMarker;

      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          (position) => {
            if (userLocationMarker) {
              // If the userLocationMarker already exists, update its position
              userLocationMarker.setPosition({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
            } else {
              // If the userLocationMarker doesn't exist yet, create it
              userLocationMarker = new window.google.maps.Marker({
                position: {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                },
                map,
                icon: {
                  path: window.google.maps.SymbolPath.CIRCLE,
                  fillColor: "#0088FF",
                  fillOpacity: 0.6,
                  strokeColor: "#FFFFFF",
                  strokeWeight: 2,
                  scale: 10,
                },
              });
            }
            map.setCenter(userLocationMarker.getPosition());
          },
          (error) => {
            console.log(error);
          },
          { enableHighAccuracy: true }
        );
      }
    }
  };

  //InitializeMap() is only called after the locations array has been populated with data
  useEffect(() => {
    initializeMap();
  }, [isLocationsLoaded]);

  useEffect(() => {
    // Load the Google Maps API script when the component mounts
    // loadGoogleMapsScript();
    setIsMapLoaded(true);
  }, []);

  return (
    <div id="map" style={{ height: "100vh", width: "100%" }}>
      <NavBar />
      {/* {isMapLoaded && <LoadScript />} */};{" "}
      {window.google === undefined ? (
        <LoadScript>
          <GoogleMap />
        </LoadScript>
      ) : (
        <GoogleMap />
      )}{" "}
    </div>
  );
};

export default BiyalikMap;
