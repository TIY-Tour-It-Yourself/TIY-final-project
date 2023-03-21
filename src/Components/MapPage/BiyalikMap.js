import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import axios from "axios";
import arIcon from "./images/ar_icon.png";
import { useLocation } from "react-router-dom";

const BiyalikMap = () => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isLocationsLoaded, setIsLocationsLoaded] = useState(false);
  const [dataArray, setDataArray] = useState([]);

  // Load the Google Maps API script
  const loadGoogleMapsScript = () => {
    //  // Check if the script tag already exists
    //  if (
    //    document.querySelectorAll(
    //      'script[src^="https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places"]'
    //    ).length > 0
    //  ) {
    //    setIsMapLoaded(true);
    //    return;
    //  }
    const script = document.createElement("script");
    //  script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAV-WIlrC-DdcfG3kDWdlRLFN4L5lP7mWI&libraries=places`;
    script.onload = () => {
      setIsMapLoaded(true);
    };
    script.onerror = () => {
      console.error("Error loading Google Maps API script");
    };
    document.body.appendChild(script);
  };

  //Get POIs from DB
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://tiys.herokuapp.com/api/pois");
        setDataArray(response.data);
        // Set the state variable to true when data is loaded
        setIsLocationsLoaded(true);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const locations = dataArray.map((item) => item.coordinates);
  const aridArray = dataArray.map((item) => item.arid.url);
  const locationName = dataArray.map((item) => item.name);
  const locationDes = dataArray.map((item) => item.description);

  //   useEffect(() => {
  //     if (locations.length > 0) {
  //       console.log(locations[0].lat);
  //     }
  //   }, [locations]);

  //   // // Array of four locations
  //   //   const locations = [
  //   //     { lat: 32.079596752557755, lng: 34.823331062420216, name: "Location 1" },
  //   //     { lat: 32.08380426675733, lng: 34.81488770244669, name: "Location 2" },
  //   //     { lat: 32.084531024037936, lng: 34.813179804299615, name: "Location 3" },
  //   //     { lat: 32.08632988098686, lng: 34.81831450580306, name: "Location 4" },
  //   //   ];

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
        locations[3].lat,
        locations[3].lng
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

  useEffect(() => {
    // Load the Google Maps API script when the component mounts
    loadGoogleMapsScript();
  }, []);

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

export default BiyalikMap;
