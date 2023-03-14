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

ReactModal.setAppElement("#root");

const Maps2 = (props) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyAV-WIlrC-DdcfG3kDWdlRLFN4L5lP7mWI",
    libraries: ["places"], // Add 'places' library here
  });
  const [currentPosition, setCurrentPosition] = useState(null);
  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);

  const originRef = useRef();
  const destiantionRef1 = useRef();
  const destiantionRef2 = useRef();
  const destiantionRef3 = useRef();
  let markers = [];

  const state = {
    currentPosition: null,
  };

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.log(error),
        { timeout: 1000 } // add a timeout of 10 seconds
      );
      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, []);

  useEffect(() => {
    if (!currentPosition) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Got current position:", position);
          setCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.log(error)
      );
    }
  }, [currentPosition]);
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  async function calculateRoute() {
    if (
      originRef.current.value === "" ||
      destiantionRef1.current.value === "" ||
      destiantionRef2.current.value === "" ||
      destiantionRef3.current.value === ""
    ) {
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destiantionRef1.current.value,

      waypoints: [
        {
          location: destiantionRef2.current.value,
          stopover: false,
        },
        {
          location: destiantionRef3.current.value,
          stopover: false,
        },
      ],
      travelMode: window.google.maps.TravelMode.WALKING,
    });

    setDirectionsResponse(results);

    // center the map on the first destination
    const firstDestination = results.routes[0].legs[0].end_location;
    map.panTo(firstDestination);

    const polylineOptions = {
      strokeColor: "#2E2EFF",
      strokeOpacity: 1,
      strokeWeight: 7,
      suppressMarkers: true,
    };
    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      polylineOptions: polylineOptions,
      suppressMarkers: true,
      map: map,
    });

    directionsRenderer.setDirections(results);

    // Create markers for each destination and add event listeners
    const markers = [];
    const destinations = results.routes[0].legs.map((leg) => leg.end_location);
    destinations.forEach((destination) => {
      const marker = new window.google.maps.Marker({
        position: destination,
        map: map,
      });
      markers.push(marker);

      marker.addListener("click", () => {
        // Show a modal when the marker is clicked
        setShowModal(true);
        setSelectedDestination(destination);
      });
    });
  }

  return isLoaded ? (
    <div>
      <div className="searchbox">
        <div className="row">
          <div className="col-lg-4">
            <Autocomplete>
              <input
                type="text"
                name="Origin"
                className="form-control"
                placeholder="Origin"
                ref={originRef}
              />
            </Autocomplete>
          </div>
          <div className="col-lg-4">
            <Autocomplete>
              <input
                type="text"
                name="Destication"
                className="form-control"
                placeholder="Destication"
                ref={destiantionRef1}
              />
            </Autocomplete>
          </div>{" "}
          <div className="col-lg-4">
            <Autocomplete>
              <input
                type="text"
                name="Destication"
                className="form-control"
                placeholder="Destication"
                ref={destiantionRef2}
              />
            </Autocomplete>
          </div>
          <div className="col-lg-4">
            <Autocomplete>
              <input
                type="text"
                name="Destication"
                className="form-control"
                placeholder="Destication"
                ref={destiantionRef3}
              />
            </Autocomplete>
          </div>
          <div className="col-lg-2">
            <button
              type="submit"
              name="submit"
              className=" btn btn-primary submit"
              onClick={calculateRoute}
            >
              Create Tour
            </button>
          </div>
          {/* <div className="col-lg-2">
            <button
              type="submit"
              name="clear"
              className="clear btn btn-danger"
              onClick={clearRoute}
            >
              Clear
            </button>
          </div> */}
        </div>
      </div>
      <div className="Map">
        <GoogleMap
          center={currentPosition} // use currentLocation if available, else use center
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "100vh" }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={(map) => setMap(map)}
        >
          <Marker position={center} onClick={handleOpenModal}></Marker>

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
export default Maps2;
