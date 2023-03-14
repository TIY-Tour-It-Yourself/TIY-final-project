import React, { useRef, useState, useEffect } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
  google,
} from "@react-google-maps/api";
import "./maps2.css";
import ReactModal from "react-modal";
import { faLess } from "@fortawesome/free-brands-svg-icons";

const center = {
  lat: 32.0809,
  lng: 34.8149,
};

const BialikMap = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyAV-WIlrC-DdcfG3kDWdlRLFN4L5lP7mWI",
    libraries: ["places"], // Add 'places' library here
  });
  const [map, setMap] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);

  const center = { lat: 32.075, lng: 34.84 };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          setCurrentPosition(center);
        }
      );
    } else {
      setCurrentPosition(center);
    }
  }, []);
  //   const origin = "1600 Amphitheatre Parkway, Mountain View, CA 94043";
  //   const destination = [
  //     "1 Hacker Way, Menlo Park, CA 94025",
  //     "345 Park Ave, San Francisco, CA 94119",
  //   ];
  // This function calculates the route and sets the directionsResponse state
  const calculateRoute = async () => {
    const origin = "Hibat Tsyion 29, Ramat Gan, Israel";
    const destination = "Kikar Rambam 5, Ramat Gan, Israel";
    const waypoints = [
      { location: "Bialik 57, Ramat Gan, Israel", stopover: true },
      { location: "Moshe Sharet 27, Ramat Gan, Israel", stopover: true },
    ];

    const directionsService = new window.google.maps.DirectionsService();
    const results = await directionsService.route({
      origin,
      destination,
      waypoints,
      travelMode: window.google.maps.TravelMode.WALKING,
    });

    console.log(results); // Add this line to check if there are any errors

    setDirectionsResponse(results);

    // Center the map on the first destination
    const firstDestination = results.routes[0].legs[0].end_location;
    map.panTo(firstDestination);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleMarkerClick = () => {
    const origin = currentPosition;
    const destination = { lat: 32.086244, lng: 34.777853 }; // replace with your destination coordinates
    calculateRoute(origin, destination);
    handleOpenModal();
  };

  return isLoaded ? (
    <div>
      <div className="Map">
        <GoogleMap
          center={currentPosition}
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "100vh" }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={(map) => {
            setMap(map);
            calculateRoute();
          }}
        >
          <Marker position={center} onClick={handleMarkerClick} />
          <ReactModal
            isOpen={showModal}
            onRequestClose={handleCloseModal}
            contentLabel="Minimal Modal Example"
          >
            <button onClick={handleCloseModal}>Close Modal</button>
          </ReactModal>
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
          {currentPosition && (
            <Marker
              position={currentPosition}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                fillColor: "blue",
                fillOpacity: 0.7,
                strokeColor: "white",
                strokeWeight: 1,
                scale: 10,
              }}
            />
          )}
        </GoogleMap>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default BialikMap;
