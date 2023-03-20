import React, { useRef, useState, useEffect } from 'react';
import {
   useJsApiLoader,
   GoogleMap,
   Marker,
   Autocomplete,
   DirectionsRenderer,
   google,
   InfoWindow,
} from '@react-google-maps/api';
import './maps2.css';
import ReactModal from 'react-modal';
import { faLess } from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';
import arIcon from './ar_icon1.png';
import { useLocation } from 'react-router-dom';

const center = {
   lat: 32.0809,
   lng: 34.8149,
};

const Map_Producer = () => {
   const { isLoaded } = useJsApiLoader({
      id: 'google-map-script',
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
      libraries: ['places'], // Add 'places' library here
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
   const { state } = useLocation();

   useEffect(() => {
      const fetchData = async () => {
         try {
            const response = await axios.get(
               'https://tiys.herokuapp.com/api/pois'
            );
            setDataArray(response.data);
         } catch (error) {
            console.log(error);
         }
      };
      fetchData();
   }, []);

   // Use dataArray.coordinates outside of useEffect
   const coordinates = dataArray.map((item) => item.coordinates);

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

   const markerPosition1 = state.selectedValues.poi1; //Beit Yad Lebanim
   const markerPosition2 = state.selectedValues.poi2; //Kikar Ramabam
   const markerPosition3 = state.selectedValues.poi3; //Beit Bialik
   const markerPosition4 = state.selectedValues.poi4; //Gan Avraham

   const calculateRoute = async (
      markerPosition1,
      markerPosition2,
      markerPosition3,
      markerPosition4
   ) => {
      if (!map || !dataArray) {
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
         suppressMarkers: false,
      });

      // Loop through the markers of the DirectionsRenderer and set their map property to null
      directionsRenderer.getDirections().routes.forEach((route) => {
         route.legs.forEach((leg) => {
            leg.steps.forEach((step) => {
               if (step.hasOwnProperty('marker')) {
                  step.marker.setMap(null);
               }
            });
         });
      });

      directionsRenderer.setOptions({ markerOptions: { visible: true } });
      directionsRenderer.setOptions({ suppressMarkers: true });

      const directionsResult = directionsRenderer.getDirections();

      // Loop through the legs array of each route to create the markers and info windows
      directionsResult.routes.forEach((route) => {
         route.legs.forEach((leg, index) => {
            // Create a marker for the start location of the leg
            const startMarker = new window.google.maps.Marker({
               position: leg.start_location,
               map: map,
               title: 'Start of Leg ' + (index + 1),
            });

            // Create an InfoWindow for the start marker
            const startInfowindow = new window.google.maps.InfoWindow({
               content: 'Custom InfoWindow Content for Marker ' + (index + 1),
            });

            // Add a click event listener to the start marker to open the InfoWindow
            startMarker.addListener('click', () => {
               startInfowindow.open(map, startMarker);
            });
         });
      });
   };

   return isLoaded ? (
      // return (
      <div>
         <div className='Map'>
            <GoogleMap
               center={currentPosition}
               zoom={15}
               mapContainerStyle={{ width: '100%', height: '100vh' }}
               options={{
                  zoomControl: false,
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: false,
                  mapTypeId: window.google.maps.MapTypeId.TERRAIN,
                  tilt: 40,
               }}
               onLoad={(map) => {
                  setMap(map);
                  calculateRoute(
                     state.selectedValues.select1,
                     state.selectedValues.select2,
                     state.selectedValues.select3,
                     state.selectedValues.select4
                  );
               }}
            >
               {directionsResponse && (
                  <DirectionsRenderer
                     directions={directionsResponse}
                     options={{ suppressMarkers: false }}
                  />
               )}

               {currentPosition && (
                  <Marker
                     position={markerPosition1}
                     onClick={handleInfoWindowOpen1}
                  >
                     {isInfoWindowOpen1 && (
                        <InfoWindow
                           onCloseClick={handleInfoWindowClose1}
                           disableAutoPan={true}
                        >
                           <div>
                              <a href='https://tiy-poc.glitch.me/1.html'>
                                 <img
                                    src={arIcon}
                                    alt='ar icon'
                                    width='30'
                                    height='30'
                                 />{' '}
                              </a>
                           </div>
                        </InfoWindow>
                     )}
                  </Marker>
               )}

               {currentPosition && (
                  <Marker
                     position={markerPosition2}
                     onClick={handleInfoWindowOpen2}
                  >
                     {isInfoWindowOpen2 && (
                        <InfoWindow
                           onCloseClick={handleInfoWindowClose2}
                           disableAutoPan={true}
                        >
                           <div>
                              <a href='https://tiy-poc.glitch.me/2.html'>
                                 {' '}
                                 <img src={arIcon} alt='ar icon' />{' '}
                              </a>
                           </div>
                        </InfoWindow>
                     )}
                  </Marker>
               )}

               {currentPosition && (
                  <Marker
                     position={markerPosition3}
                     onClick={handleInfoWindowOpen3}
                  >
                     {isInfoWindowOpen3 && (
                        <InfoWindow
                           onCloseClick={handleInfoWindowClose3}
                           disableAutoPan={true}
                        >
                           <div>
                              <a href='https://tiy-poc.glitch.me/3.html'>
                                 <img src={arIcon} alt='ar icon' />{' '}
                              </a>
                           </div>
                        </InfoWindow>
                     )}
                  </Marker>
               )}

               {currentPosition && (
                  <Marker
                     position={markerPosition4}
                     onClick={handleInfoWindowOpen4}
                  >
                     {isInfoWindowOpen4 && (
                        <InfoWindow
                           onCloseClick={handleInfoWindowClose4}
                           disableAutoPan={true}
                        >
                           <div>
                              <a href='https://tiy-poc.glitch.me/4.html'>
                                 <img src={arIcon} alt='ar icon' />{' '}
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
                        fillColor: 'blue',
                        fillOpacity: 0.7,
                        strokeColor: 'white',
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

export default Map_Producer;
