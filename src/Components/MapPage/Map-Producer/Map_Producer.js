import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import axios from "axios";
import arIcon from "./ar_icon1.png";
import { useLocation } from "react-router-dom";

const Map_Producer = () => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isLocationsLoaded, setIsLocationsLoaded] = useState(false);
  const [dataArray, setDataArray] = useState([]);
  const location = useLocation();
  const [poiData, setPoiData] = useState([]);
  const [poiids, setPoiids] = useState([]);
  const [poiDataArray, setPoiDataArray] = useState([]);
  const [locations, setLocations] = useState([]);
  const [names, setNames] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newPoiids = [];

    for (let i = 1; i <= 4; i++) {
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
        console.log(poiDataResults);
        const poiDataArray = poiDataResults.map((result) => result.data);
        setPoiDataArray(poiDataArray);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [location]);

// get coordinates from pois
useEffect(() => {
  console.log(poiDataArray);
  if (poiDataArray && poiDataArray.length > 0) {
    const newLocations = poiDataArray.slice(0, 4).map((item) => item[0].coordinates);
    console.log(newLocations);
    setLocations(newLocations);
    setIsLocationsLoaded(true); // set isLocationsLoaded to true
  }
}, [poiDataArray]);
console.log(locations);




  //Get POIs from DB
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get("https://tiys.herokuapp.com/api/pois");
  //       setDataArray(response.data);
  //       // Set the state variable to true when data is loaded
  //       setIsLocationsLoaded(true);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchData();
  // }, []);

  // const locations = dataArray.map((item) => item.coordinates);
  const aridArray = dataArray.map((item) => item.arid.url);
  const locationName = dataArray.map((item) => item.name);
  const locationDes = dataArray.map((item) => item.description);

  //   useEffect(() => {
  //     if (locations.length > 0) {
  //       console.log(locations[0].lat);
  //     }
  //   }, [locations]);

  // // Array of four locations
  //   const locations = [
  //     { lat: 32.079596752557755, lng: 34.823331062420216, name: "Location 1" },
  //     { lat: 32.08380426675733, lng: 34.81488770244669, name: "Location 2" },
  //     { lat: 32.084531024037936, lng: 34.813179804299615, name: "Location 3" },
  //     { lat: 32.08632988098686, lng: 34.81831450580306, name: "Location 4" },
  //   ];

  //   const locations = dataArray.map((item) => item.coordinates);
  //   console.log(locations);
  //   console.log(locations[0].lat);

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
        locations[locations.length-1].lat,
        locations[locations.length-1].lng
      );

      const request = {
        origin: origin,
        destination: destination,
        waypoints: [
          {
            location: new window.google.maps.LatLng(
              locations[1].lat,
              locations[1].lng
            ),
            stopover: true,
          },
          {
            location: new window.google.maps.LatLng(
              locations[2].lat,
              locations[2].lng
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
      // Create a Marker object for each location and add an info window
      locations.forEach((location) => {
        const marker = new window.google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map: map,
        });

        aridArray.forEach((arid) => {
          const infoWindow = new window.google.maps.InfoWindow({
            content: location.name, // set the content of the info window
          });

          marker.addListener("click", () => {
            infoWindow.open(map, marker); // open the info window when the marker is clicked
          });
        });
      });

      // Create a Marker object for each location and add an info window
      locations.forEach((location, index) => {
        const marker = new window.google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map: map,
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div>
                               <h3>${locationName[index]}</h3>
                               <a href="${aridArray[index]}" target="_blank">
                                 <img src="${arIcon}" alt="AR Icon">
                               </a>
                             </div>`,
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });
      });

      // Create a Marker object for the current user location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const userLocationMarker = new window.google.maps.Marker({
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
          map.setCenter(userLocationMarker.getPosition());
        });
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
      {/* {isMapLoaded && <LoadScript />} */}
      {window.google === undefined ? (
        <LoadScript>
          <GoogleMap />
        </LoadScript>
      ) : (
        <GoogleMap />
      )}
    </div>
  );
};

export default Map_Producer;
