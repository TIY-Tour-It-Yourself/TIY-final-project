// import React, { useRef, useState, useEffect } from "react";
// import {
//   useJsApiLoader,
//   GoogleMap,
//   Marker,
//   Autocomplete,
//   DirectionsRenderer,
//   google,
//   InfoWindow,
// } from "@react-google-maps/api";
// import "./maps2.css";
// import ReactModal from "react-modal";
// import { faLess } from "@fortawesome/free-brands-svg-icons";
// import axios from "axios";
// import arIcon from "./images/ar_icon.png";

// const center = {
//   lat: 32.0809,
//   lng: 34.8149,
// };

// const BialikMap = () => {
//   const { isLoaded } = useJsApiLoader({
//     id: "google-map-script",
//     googleMapsApiKey: "AIzaSyAV-WIlrC-DdcfG3kDWdlRLFN4L5lP7mWI",
//     libraries: ["places"], // Add 'places' library here
//   });
//   console.log(isLoaded.id);
//   const [map, setMap] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [directionsResponse, setDirectionsResponse] = useState(null);
//   const [currentPosition, setCurrentPosition] = useState(null);
//   const [isInfoWindowOpen1, setIsInfoWindowOpen1] = useState(false);
//   const [isInfoWindowOpen2, setIsInfoWindowOpen2] = useState(false);
//   const [isInfoWindowOpen3, setIsInfoWindowOpen3] = useState(false);
//   const [isInfoWindowOpen4, setIsInfoWindowOpen4] = useState(false);
//   const [data, setData] = useState([]);
//   const [dataArray, setDataArray] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get("https://tiys.herokuapp.com/api/pois");
//         setDataArray(response.data);
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     fetchData();
//   }, []);

//   // Use dataArray.coordinates outside of useEffect
//   const coordinates = dataArray.map((item) => item.coordinates);
//   console.log(coordinates[0]);

//   const handleInfoWindowOpen1 = () => {
//     setIsInfoWindowOpen1(true);
//   };

//   const handleInfoWindowClose1 = () => {
//     setIsInfoWindowOpen1(false);
//   };

//   const handleInfoWindowOpen2 = () => {
//     setIsInfoWindowOpen2(true);
//   };

//   const handleInfoWindowClose2 = () => {
//     setIsInfoWindowOpen2(false);
//   };
//   const handleInfoWindowOpen3 = () => {
//     setIsInfoWindowOpen3(true);
//   };

//   const handleInfoWindowClose3 = () => {
//     setIsInfoWindowOpen3(false);
//   };
//   const handleInfoWindowOpen4 = () => {
//     setIsInfoWindowOpen4(true);
//   };

//   const handleInfoWindowClose4 = () => {
//     setIsInfoWindowOpen4(false);
//   };
//   const center = { lat: 32.075, lng: 34.84 };
//   useEffect(() => {
//     const geo = navigator.geolocation;

//     if (!geo) {
//       setCurrentPosition(center);
//       return;
//     }

//     const watcher = geo.watchPosition(
//       (position) => {
//         setCurrentPosition({
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         });
//       },
//       () => {
//         setCurrentPosition(center);
//       }
//     );

//     return () => geo.clearWatch(watcher);
//   }, []);

//   const markerPosition1 = { lat: 32.079596752557755, lng: 34.823331062420216 }; //Beit Yad Lebanim
//   const markerPosition2 = { lat: 32.08380426675733, lng: 34.81488770244669 }; //Kikar Ramabam
//   const markerPosition3 = { lat: 32.084531024037936, lng: 34.813179804299615 }; //Beit Bialik
//   const markerPosition4 = { lat: 32.08632988098686, lng: 34.8183145058031 }; //Gan Avrahm

//   const calculateRoute = async (
//     markerPosition1,
//     markerPosition2,
//     markerPosition3,
//     markerPosition4
//   ) => {
//     if (!map) {
//       return;
//     }

//     const origin = markerPosition1;
//     const destination = markerPosition2;
//     const waypoints = [
//       { location: markerPosition3, stopover: true },
//       { location: markerPosition4, stopover: true },
//     ];

//     const directionsService = new window.google.maps.DirectionsService();
//     const results = await directionsService.route({
//       origin,
//       destination,
//       waypoints,
//       travelMode: window.google.maps.TravelMode.WALKING,
//     });

//     console.log(results); // Add this line to check if there are any errors

//     setDirectionsResponse(results);

//     // Center the map on the first destination
//     const firstDestination = results.routes[0].legs[0].end_location;
//     map.panTo(firstDestination);

//     // Create a DirectionsRenderer object to display the route
//     const directionsRenderer = new window.google.maps.DirectionsRenderer({
//       map,
//       directions: results,
//       suppressMarkers: true,
//     });

//     // Loop through the markers of the DirectionsRenderer and set their map property to null
//     directionsRenderer.getDirections().routes.forEach((route) => {
//       route.legs.forEach((leg) => {
//         leg.steps.forEach((step) => {
//           if (step.hasOwnProperty("marker")) {
//             step.marker.setMap(null);
//           }
//         });
//       });
//     });

//     directionsRenderer.setOptions({ markerOptions: { visible: false } });
//     directionsRenderer.setOptions({ suppressMarkers: true });

//     // Get the DirectionsResult object from the DirectionsRenderer
//     const directionsResult = directionsRenderer.getDirections();

//     // Loop through the legs array of each route to create the markers and info windows
//     directionsResult.routes.forEach((route) => {
//       route.legs.forEach((leg, index) => {
//         // Create a marker for the start location of the leg
//         const startMarker = new window.google.maps.Marker({
//           position: leg.start_location,
//           map: map,
//           title: "Start of Leg " + (index + 1),
//         });
//       });
//     });
//   };

//   return isLoaded ? (
//     <div>
//       <div className="Map">
//         <GoogleMap
//           center={currentPosition}
//           zoom={15}
//           mapContainerStyle={{ width: "100%", height: "100vh" }}
//           options={{
//             zoomControl: false,
//             streetViewControl: true,
//             mapTypeControl: true,
//             fullscreenControl: true,
//             mapTypeId: window.google.maps.MapTypeId.TERRAIN,
//             tilt: 60,
//           }}
//           onLoad={(map) => {
//             setMap(map);
//             calculateRoute(
//               markerPosition1,
//               markerPosition2,
//               markerPosition3,
//               markerPosition4
//             );
//           }}
//           calculateRoute={calculateRoute} // pass the calculateRoute function as a prop
//         >
//           {directionsResponse && (
//             <DirectionsRenderer
//               directions={directionsResponse}
//               options={{ suppressMarkers: true }}
//             />
//           )}

//           {currentPosition && (
//             <Marker position={markerPosition1} onClick={handleInfoWindowOpen1}>
//               {isInfoWindowOpen1 && (
//                 <InfoWindow
//                   onCloseClick={handleInfoWindowClose1}
//                   disableAutoPan={true}
//                 >
//                   <div>
//                     <a href="https://tiy-poc.glitch.me/1.html">
//                       <img src={arIcon} alt="ar icon" />{" "}
//                     </a>
//                   </div>
//                 </InfoWindow>
//               )}
//             </Marker>
//           )}

//           {currentPosition && (
//             <Marker position={markerPosition2} onClick={handleInfoWindowOpen2}>
//               {isInfoWindowOpen2 && (
//                 <InfoWindow
//                   onCloseClick={handleInfoWindowClose2}
//                   disableAutoPan={true}
//                 >
//                   <div>
//                     <a href="https://tiy-poc.glitch.me/2.html">
//                       {" "}
//                       <img src={arIcon} alt="ar icon" />{" "}
//                     </a>
//                   </div>
//                 </InfoWindow>
//               )}
//             </Marker>
//           )}

//           {currentPosition && (
//             <Marker position={markerPosition3} onClick={handleInfoWindowOpen3}>
//               {isInfoWindowOpen3 && (
//                 <InfoWindow
//                   onCloseClick={handleInfoWindowClose3}
//                   disableAutoPan={true}
//                 >
//                   <div>
//                     <a href="https://tiy-poc.glitch.me/3.html">
//                       <img src={arIcon} alt="ar icon" />{" "}
//                     </a>
//                   </div>
//                 </InfoWindow>
//               )}
//             </Marker>
//           )}

//           {currentPosition && (
//             <Marker position={markerPosition4} onClick={handleInfoWindowOpen4}>
//               {isInfoWindowOpen4 && (
//                 <InfoWindow
//                   onCloseClick={handleInfoWindowClose4}
//                   disableAutoPan={true}
//                 >
//                   <div>
//                     <a href="https://tiy-poc.glitch.me/4.html">
//                       <img src={arIcon} alt="ar icon" />{" "}
//                     </a>
//                   </div>
//                 </InfoWindow>
//               )}
//             </Marker>
//           )}

//           {currentPosition && (
//             <Marker
//               position={currentPosition}
//               icon={{
//                 path: window.google.maps.SymbolPath.CIRCLE,
//                 fillColor: "blue",
//                 fillOpacity: 0.7,
//                 strokeColor: "white",
//                 strokeWeight: 1,
//                 scale: 10,
//               }}
//             />
//           )}
//         </GoogleMap>
//       </div>
//     </div>
//   ) : (
//     <></>
//   );
// };

// export default BialikMap;
import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import axios from "axios";
import arIcon from "./images/ar_icon.png";

const BialikMap = () => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
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
      travelMode: window.google.maps.TravelMode.DRIVING,
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
        <LoadScript googleMapsApiKey="AIzaSyAV-WIlrC-DdcfG3kDWdlRLFN4L5lP7mWI">
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

export default BialikMap;
