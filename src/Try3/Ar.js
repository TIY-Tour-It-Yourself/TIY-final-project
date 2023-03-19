// import React, { useRef, useEffect } from "react";
// import * as THREE from "three";
// // import ARjs from "ar.js";
// import markerPattern from "./assets/balloons.jpg";

// const ARComponent = () => {
//   const canvasRef = useRef();

//   useEffect(() => {
//     const scene = new ARjs.Scene();
//     const camera = new THREE.Camera();

//     // Add marker to scene
//     const marker = new ARjs.Marker({
//       type: "pattern",
//       patternUrl: "markerPattern",
//     });
//     scene.add(marker);

//     // Create renderer
//     const renderer = new THREE.WebGLRenderer({
//       antialias: true,
//       alpha: true,
//       canvas: canvasRef.current,
//     });
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.setPixelRatio(window.devicePixelRatio);

//     // Render AR scene
//     const render = () => {
//       renderer.render(scene, camera);
//       requestAnimationFrame(render);
//     };
//     requestAnimationFrame(render);
//   }, []);

//   return <canvas ref={canvasRef} />;
// };

// export default ARComponent;
// import React, { Component } from "react";
// import {
//   Map,
//   Marker,
//   DirectionsRenderer,
//   GoogleApiWrapper,
// } from "google-maps-react";

// class MapContainer1 extends Component {
//   state = {
//     directions: null,
//   };

//   componentDidMount() {
//     const { google } = this.props;
//     const DirectionsService = new google.maps.DirectionsService();

//     DirectionsService.route(
//       {
//         origin: { lat: 32.0853, lng: 34.7818 },
//         destination: { lat: 31.7767, lng: 35.2345 },
//         waypoints: [
//           { location: { lat: 32.794, lng: 34.9896 } },
//           { location: { lat: 31.6697, lng: 34.5715 } },
//         ],
//         optimizeWaypoints: true,
//         travelMode: google.maps.TravelMode.DRIVING,
//       },
//       (result, status) => {
//         if (status === "OK") {
//           this.setState({ directions: result });
//         } else {
//           console.error(`Failed to calculate route: ${status}`);
//         }
//       }
//     );
//   }

//   render() {
//     const { google } = this.props;
//     const { directions } = this.state;

//     if (!google) {
//       return <div> Loading... </div>;
//     }

//     return (
//       <Map
//         google={google}
//         zoom={9}
//         initialCenter={{ lat: 32.0853, lng: 34.7818 }}
//       >
//         <Marker position={{ lat: 32.0853, lng: 34.7818 }} />{" "}
//         <Marker position={{ lat: 31.7767, lng: 35.2345 }} />{" "}
//         <Marker position={{ lat: 32.794, lng: 34.9896 }} />{" "}
//         <Marker position={{ lat: 31.6697, lng: 34.5715 }} />{" "}
//         {directions && (
//           <DirectionsRenderer
//             directions={directions}
//             options={{
//               polylineOptions: {
//                 strokeColor: "#000",
//                 strokeOpacity: 0.8,
//                 strokeWeight: 6,
//               },
//             }}
//           />
//         )}{" "}
//       </Map>
//     );
//   }
// }

// export default GoogleApiWrapper({
//   apiKey: "AIzaSyAV-WIlrC-DdcfG3kDWdlRLFN4L5lP7mWI",
// })(MapContainer1);
