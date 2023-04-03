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
import { Modal } from "react-bootstrap";
import Evaluations from "../../EvaluationPage/Evaluations";

const Map_Producer = () => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isLocationsLoaded, setIsLocationsLoaded] = useState(false);
  const [dataArray, setDataArray] = useState([]);
  const [poiData, setPoiData] = useState([]);
  const [poiids, setPoiids] = useState([]);
  const [poiDataArray, setPoiDataArray] = useState([]);
  const [locations, setLocations] = useState([]);
  const [names, setNames] = useState([]);
  const [isNamesLoaded, setIsNamesLoaded] = useState(false);
  const [ARElements, setARElements] = useState([]);
  const [isARLoaded, setIsARLoaded] = useState(false);
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newPoiids = [];

    const numOfPois = Array.from(params.keys()).filter((k) =>
      k.startsWith("poi")
    ).length;
    console.log(numOfPois);
    for (let i = 1; i <= numOfPois; i++) {
      const poiid = params.get(`poi${i}`);
      newPoiids.push(poiid);
    }

    // get pois from the database
    const fetchData = async () => {
      try {
        const poiDataPromises = newPoiids.map((id) =>
          axios.get(`https://tiys.herokuapp.com/api/pois/${id}`)
        );
        const poiDataResults = await Promise.all(poiDataPromises);
        const poiDataArray = poiDataResults.map((result) => result.data);
        setPoiDataArray(poiDataArray);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [location]);

  //Get Coordinates from POIS
  useEffect(() => {
    if (poiDataArray && poiDataArray.length > 0) {
      const newLocations = poiDataArray.map((item) => item[0].coordinates);
      setLocations(newLocations);
      setIsLocationsLoaded(true); // set isLocationsLoaded to true
    }
  }, [poiDataArray]);

  useEffect(() => {
    if (poiDataArray && poiDataArray.length > 0) {
      const newNames = poiDataArray.map((item) => item[0].name);
      setNames(newNames);
      setIsNamesLoaded(true);
    }
  }, [poiDataArray]);

  useEffect(() => {
    if (poiDataArray && poiDataArray.length > 0) {
      const newAR = poiDataArray.map((item) => item[0].arid.url);
      setARElements(newAR);
      setIsARLoaded(true);
    }
  }, [poiDataArray]);
  const initializeMap = () => {
    // Check if locations data is loaded and available
    if (isLocationsLoaded && locations.length > 0) {
      // Create a map object and center it on the first location
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: locations[0].lat, lng: locations[0].lng },
        zoom: 12,
      });
      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: true, // add this line to suppress markers
      });
      const origin = new window.google.maps.LatLng(
        locations[0].lat,
        locations[0].lng
      );
      const destination = new window.google.maps.LatLng(
        locations[locations.length - 1].lat,
        locations[locations.length - 1].lng
      );

      const waypoints = [];
      for (let i = 1; i < locations.length - 1; i++) {
        waypoints.push({
          location: new window.google.maps.LatLng(
            locations[i].lat,
            locations[i].lng
          ),
          stopover: true,
        });
      }

      const request = {
        origin: origin,
        destination: destination,
        waypoints: waypoints,
        travelMode: window.google.maps.TravelMode.WALKING,
      };

      directionsService.route(request, function (response, status) {
        if (status == window.google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(response);
        }
      });

      // Create a Marker object for each location and add an info window
      locations.forEach((location, index) => {
        const marker = new window.google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map: map,
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div style="display: flex; justify-content: center; flex-direction: column;">
                      <div style="margin-left: 10px;"><h4>${names[index]}</h4></div>
                        <div style="display: flex; justify-content: center; flex-direction: row; margin-left: 5px;">
                          <div style={{backgroundColor: 'transparent', textAlign: 'center'}}>
                            <a href="${ARElements[index]}" target="_blank">
                              <img src="${arIcon}" width='40px' height='40px' alt='${names[index]}'>
                            </a>
                          </div>
                          <div>
                          <a href="Evaluations" style="text-decoration: none;">
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
    if (window.google) {
      initializeMap();
    }
  }, [isLocationsLoaded]);

  return (
    <div id="map" style={{ height: "100vh", width: "100%" }}>
      {" "}
      {/* {isMapLoaded && <LoadScript />} */}{" "}
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

export default Map_Producer;
