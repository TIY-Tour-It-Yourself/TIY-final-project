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
import BialikMap from "./BialikMap";

const BialikMap2 = () => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [dataArray, setDataArray] = useState([]);
  // const { state } = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://tiys.herokuapp.com/api/pois");
        setDataArray(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  // Use dataArray.coordinates outside of useEffect
  const coordinates = dataArray.map((item) => item.coordinates);
  // console.log(coordinates[0].lat);

  // Load the Google Maps API script
  const loadGoogleMapsScript = () => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAV-WIlrC-DdcfG3kDWdlRLFN4L5lP7mWI&libraries=places`;
    script.onload = () => {
      initializeMap();
    };
    document.body.appendChild(script);
  };

  // Array of four locations
  const locations = [
    { lat: 31.7767, lng: 35.2345, name: "Location 1" },
    { lat: 32.0853, lng: 34.7818, name: "Location 2" },
    { lat: 32.794, lng: 34.9896, name: "Location 3" },
    { lat: 32.794, lng: 34.9896, name: "Location 4" },
  ];
  // const locations = [
  //   state.selectedValues.select1,
  //   state.selectedValues.select2,
  //   state.selectedValues.select3,
  //   state.selectedValues.select4,
  // ];
  const initializeMap = () => {
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

      const infoWindow = new window.google.maps.InfoWindow({
        content: location.name, // set the content of the info window
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker); // open the info window when the marker is clicked
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
  };

  useEffect(() => {
    // Load the Google Maps API script when the component mounts
    loadGoogleMapsScript();
    setIsMapLoaded(true);
  }, []);

  return (
    <div id="map" style={{ height: "400px", width: "100%" }}>
      {isMapLoaded && (
        <LoadScript>
          <GoogleMap
            mapContainerStyle={{ height: "100%", width: "100%" }}
            center={{ lat: locations[0].lat, lng: locations[0].lng }}
            zoom={12}
          >
            <DirectionsService
              options={{
                destination: { lat: locations[3].lat, lng: locations[3].lng },
                origin: { lat: locations[0].lat, lng: locations[0].lng },
                travelMode: window.google.maps.TravelMode.DRIVING,
              }}
            >
              {(result) => {
                return (
                  <DirectionsRenderer
                    options={{
                      directions: result,
                    }}
                  />
                );
              }}
            </DirectionsService>
          </GoogleMap>
        </LoadScript>
      )}
    </div>
  );
};

export default BialikMap2;
