import React, { useRef, useState, useEffect } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
  google,
  InfoWindow,
} from "@react-google-maps/api";
import "./maps2.css";
import ReactModal from "react-modal";
import { faLess } from "@fortawesome/free-brands-svg-icons";
import axios from "axios";
import arIcon from "./images/ar_icon.png";

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
  const [isInfoWindowOpen1, setIsInfoWindowOpen1] = useState(false);
  const [isInfoWindowOpen2, setIsInfoWindowOpen2] = useState(false);
  const [isInfoWindowOpen3, setIsInfoWindowOpen3] = useState(false);
  const [isInfoWindowOpen4, setIsInfoWindowOpen4] = useState(false);
  const [data, setData] = useState([]);
  const [dataArray, setDataArray] = useState([]);

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
  console.log(coordinates[0]);

  const handleInfoWindowOpen1 = () => {
    setIsInfoWindowOpen1(true);
  };

  const handleInfoWindowClose1 = () => {
    setIsInfoWindowOpen1(false);
  };

  const handleInfoWindowOpen2 = () => {
    setIsInfoWindowOpen2(true);
  };

  const handleInfoWindowClose2 = () => {
    setIsInfoWindowOpen2(false);
  };
  const handleInfoWindowOpen3 = () => {
    setIsInfoWindowOpen3(true);
  };

  const handleInfoWindowClose3 = () => {
    setIsInfoWindowOpen3(false);
  };
  const handleInfoWindowOpen4 = () => {
    setIsInfoWindowOpen4(true);
  };

  const handleInfoWindowClose4 = () => {
    setIsInfoWindowOpen4(false);
  };
  const center = { lat: 32.075, lng: 34.84 };
  useEffect(() => {
    const geo = navigator.geolocation;

    if (!geo) {
      setCurrentPosition(center);
      return;
    }

    const watcher = geo.watchPosition(
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

    return () => geo.clearWatch(watcher);
  }, []);

  const markerPosition1 = { lat: 32.079596752557755, lng: 34.823331062420216 }; //Beit Yad Lebanim
  const markerPosition2 = { lat: 32.08380426675733, lng: 34.81488770244669 }; //Kikar Ramabam
  const markerPosition3 = { lat: 32.084531024037936, lng: 34.813179804299615 }; //Beit Bialik
  const markerPosition4 = { lat: 32.08632988098686, lng: 34.8183145058031 }; //Gan Avrahm

  const calculateRoute = async () => {
    if (!map) {
      return;
    }

    const origin = markerPosition1;
    const destination = markerPosition2;
    const waypoints = [
      { location: markerPosition3, stopover: true },
      { location: markerPosition4, stopover: true },
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

    // Create a DirectionsRenderer object to display the route
    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      map,
      directions: results,
      suppressMarkers: true,
    });

    // Loop through the markers of the DirectionsRenderer and set their map property to null
    directionsRenderer.getDirections().routes.forEach((route) => {
      route.legs.forEach((leg) => {
        leg.steps.forEach((step) => {
          if (step.hasOwnProperty("marker")) {
            step.marker.setMap(null);
          }
        });
      });
    });
    // Remove all markers from the DirectionsRenderer
    const markerArray = directionsRenderer
      .getDirections()
      .routes.flatMap((route) => route.legs.flatMap((leg) => leg.steps))
      .flatMap((step) => step.path)
      .map((location, index) => {
        return new window.google.maps.Marker({
          position: location,
          map: map,
          title: "Marker " + (index + 1),
        });
      });
    directionsRenderer.setOptions({ markerOptions: { visible: false } });
    directionsRenderer.setOptions({ suppressMarkers: true });

    // Get the DirectionsResult object from the DirectionsRenderer
    const directionsResult = directionsRenderer.getDirections();

    // Loop through the legs array of each route to create the markers and info windows
    directionsResult.routes.forEach((route) => {
      route.legs.forEach((leg, index) => {
        // Create a marker for the start location of the leg
        const startMarker = new window.google.maps.Marker({
          position: leg.start_location,
          map: map,
          title: "Start of Leg " + (index + 1),
        });

        // Create an InfoWindow for the start marker
        const startInfowindow = new window.google.maps.InfoWindow({
          content: "Custom InfoWindow Content for Marker " + (index + 1),
        });

        // Add a click event listener to the start marker to open the InfoWindow
        startMarker.addListener("click", () => {
          startInfowindow.open(map, startMarker);
        });
      });
    });
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
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
          {directionsResponse && (
            <DirectionsRenderer
              directions={directionsResponse}
              options={{ suppressMarkers: true }}
            />
          )}

          {currentPosition && (
            <Marker position={markerPosition1} onClick={handleInfoWindowOpen1}>
              {isInfoWindowOpen1 && (
                <InfoWindow
                  onCloseClick={handleInfoWindowClose1}
                  disableAutoPan={true}
                >
                  <div>
                    <a href="https://tiy-poc.glitch.me/1.html" target="_blank">
                      <img src={arIcon} alt="ar icon" />{" "}
                    </a>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          )}

          {currentPosition && (
            <Marker position={markerPosition2} onClick={handleInfoWindowOpen2}>
              {isInfoWindowOpen2 && (
                <InfoWindow
                  onCloseClick={handleInfoWindowClose2}
                  disableAutoPan={true}
                >
                  <div>
                    <a href="https://tiy-poc.glitch.me/2.html" target="_blank">
                      {" "}
                      <img src={arIcon} alt="ar icon" />{" "}
                    </a>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          )}

          {currentPosition && (
            <Marker position={markerPosition3} onClick={handleInfoWindowOpen3}>
              {isInfoWindowOpen3 && (
                <InfoWindow
                  onCloseClick={handleInfoWindowClose3}
                  disableAutoPan={true}
                >
                  <div>
                    <a href="https://tiy-poc.glitch.me/3.html" target="_blank">
                      <img src={arIcon} alt="ar icon" />{" "}
                    </a>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          )}

          {currentPosition && (
            <Marker position={markerPosition4} onClick={handleInfoWindowOpen4}>
              {isInfoWindowOpen4 && (
                <InfoWindow
                  onCloseClick={handleInfoWindowClose4}
                  disableAutoPan={true}
                >
                  <div>
                    <a href="https://tiy-poc.glitch.me/4.html" target="_blank">
                      <img src={arIcon} alt="ar icon" />{" "}
                    </a>
                  </div>
                </InfoWindow>
              )}
            </Marker>
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
