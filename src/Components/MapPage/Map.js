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
// import styles from "./Map.module.css";
// import ReactModal from "react-modal";
// import { faLess } from "@fortawesome/free-brands-svg-icons";

// const center = {
//   lat: 32.0809,
//   lng: 34.8149,
// };

// const Map = () => {
//   const { isLoaded } = useJsApiLoader({
//     id: "google-map-script",
//     googleMapsApiKey: "AIzaSyAV-WIlrC-DdcfG3kDWdlRLFN4L5lP7mWI",
//     libraries: ["places"], // Add 'places' library here
//   });
//   const [map, setMap] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [directionsResponse, setDirectionsResponse] = useState(null);
//   const [currentPosition, setCurrentPosition] = useState(null);

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

//   const calculateRoute = async () => {
//     if (!map) {
//       return;
//     }

//     const origin = "Hibat Tsyion 29, Ramat Gan, Israel";
//     const destination = "Kikar Rambam 5, Ramat Gan, Israel";
//     const waypoints = [
//       { location: "Bialik 57, Ramat Gan, Israel", stopover: true },
//       { location: "Moshe Sharet 27, Ramat Gan, Israel", stopover: true },
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

//     //Center the map on the first destination
//     const firstDestination = results.routes[0].legs[0].end_location;
//     map.panTo(firstDestination);

//     const infowindow = new window.google.maps.InfoWindow();

//     const directionsRenderer = new window.google.maps.DirectionsRenderer({
//       map,
//       directions: results,
//     });

//     // Loop through the legs array to create markers and infowindows
//     results.routes[0].legs.forEach((leg, index) => {
//       // Create a marker for the start location of the leg
//       const startMarker = new window.google.maps.Marker({
//         position: leg.start_location,
//         map: map,
//         title: "Start of Leg " + (index + 1),
//       });

//       // Add a click event listener to the start marker
//       startMarker.addListener("click", () => {
//         infowindow.setContent(
//           "Custom InfoWindow Content for Marker " + (index + 1)
//         );
//         infowindow.open(map, startMarker);
//       });
//     });
//   };

//   const handleOpenModal = () => {
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//   };

//   // const handleMarkerClick = () => {
//   //   const origin = currentPosition;
//   //   const destination = { lat: 32.086244, lng: 34.777853 }; // replace with your destination coordinates
//   //   calculateRoute(origin, destination);
//   //   handleOpenModal();
//   // };
//   //   const calculateRoute = async (origin, destination, waypoints) => {
//   //     origin.lat = 32.079644384470605;
//   //     origin.lng = 34.82333845176885;

//   //     destination.lat = 32.0841376287447;
//   //     destination.lng = 34.8151070818446;

//   //     const directionsService = new window.google.maps.DirectionsService();
//   //     const results = await directionsService.route({
//   //       origin: new window.google.maps.LatLng(origin.lat, origin.lng),
//   //       destination: new window.google.maps.LatLng(
//   //         destination.lat,
//   //         destination.lng
//   //       ),
//   //         waypoints: waypoints.map((waypoint) => ({
//   //           location: new window.google.maps.LatLng(waypoint.lat, waypoint.lng),
//   //           stopover: true,
//   //         })),
//   //       travelMode: window.google.maps.TravelMode.WALKING,
//   //     });

//   //     console.log(results); // Add this line to check if there are any errors

//   //     setDirectionsResponse(results);

//   //     // Center the map on the first destination
//   //     const firstDestination = results.routes[0].legs[0].end_location;
//   //     map.panTo(firstDestination);
//   //   };

//   const handleMarkerClick = () => {
//     if (!origin || !destination) {
//       console.error("Origin or destination is undefined or null");
//       return;
//     }

//     const origin = currentPosition;
//     const destination = { lat: 32.086244, lng: 34.777853 }; // replace with your destination coordinates
//     const waypoints = [
//       { lat: 32.086, lng: 34.78 }, // replace with your waypoint coordinates
//       { lat: 32.087, lng: 34.777 },
//     ];
//     calculateRoute(origin, destination, waypoints);
//     handleOpenModal();
//   };
//   return isLoaded ? (
//     <div>
//       <div className={styles.Map}>
//         <GoogleMap
//           center={currentPosition}
//           zoom={15}
//           mapContainerStyle={{ width: "100%", height: "100vh" }}
//           options={{
//             zoomControl: false,
//             streetViewControl: false,
//             mapTypeControl: false,
//             fullscreenControl: false,
//           }}
//           onLoad={(map) => {
//             setMap(map);
//             calculateRoute();
//           }}
//         >
//           <Marker position={center} onClick={handleMarkerClick} />{" "}
//           <ReactModal
//             isOpen={showModal}
//             onRequestClose={handleCloseModal}
//             contentLabel="Minimal Modal Example"
//           >
//             <button onClick={handleCloseModal}> Close Modal </button>{" "}
//           </ReactModal>{" "}
//           {directionsResponse && (
//             <DirectionsRenderer directions={directionsResponse} />
//           )}
//           {/* Position Blue Circle */}{" "}
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
//           )}{" "}
//         </GoogleMap>{" "}
//       </div>{" "}
//     </div>
//   ) : (
//     <> </>
//   );
// };

// export default Map;
