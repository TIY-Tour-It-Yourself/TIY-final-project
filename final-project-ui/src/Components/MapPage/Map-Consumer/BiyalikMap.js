import React, { useState, useEffect } from 'react';
import {
   GoogleMap,
   LoadScript,
   DirectionsService,
   DirectionsRenderer,
} from '@react-google-maps/api';
import axios from 'axios';
import arIcon from './images/ar_icon1.png';
import ranking from './images/star.png';
import { useLocation, useNavigate } from 'react-router-dom';

const BiyalikMap = (props) => {
   const [isMapLoaded, setIsMapLoaded] = useState(false);
   const [isLocationsLoaded, setIsLocationsLoaded] = useState(false);
   const [poisData, setPoisData] = useState([]);
   const [isPoisDataLoaded, setIsPoisDataLoaded] = useState('');
   const [poisLatData, setPoisLatData] = useState([]);
   const [poisLngData, setPoisLngData] = useState([]);
   const [poisCoordinatesData, setPoisCoordinatesData] = useState([]);
   const [isNamesLoaded, setIsNamesLoaded] = useState(false);
   const [isURLsLoaded, setIsURLsLoaded] = useState(false);
   const [locationName, setLocationName] = useState([]);
   const [ARURLArray, setARURLArray] = useState([]);
   const [poisNames, setPoisNames] = useState([]);
   const [poisIdNums, setPoisIdNums] = useState([]);

   const location = useLocation();
   const navigate = useNavigate();

   useEffect(() => {
      console.log(location);
      if (!location.state) {
         navigate('/');
      } else {
         axios
            .get(`https://tiys.herokuapp.com/api/auth`, {
               headers: {
                  'x-auth-token': location.state.token,
                  'Content-Type': 'application/json',
               },
            })
            .then((response) => {
               // console.log(response.data);
            })
            .catch((error) => {
               console.error('Error fetching user: ', error);
            });
      }
   }, [location.state]);

   useEffect(() => {
      const searchParams = new URLSearchParams(location.search);
      const routeChosen = searchParams.get('routeId');

      //Get Route by ID
      const fetchRoute = async () => {
         try {
            const response = await axios.get(
               `https://tiys.herokuapp.com/api/routes/${routeChosen}`
            );
            //Get route pois
            const pois = response.data[0].pois;
            const poisIds = pois.map((poi) => poi.poiid);

            //Get all pois' coordinates
            const coordinatesArray = pois.map((poi) => poi.coordinates);

            setPoisCoordinatesData(coordinatesArray);

            let latArray = [];
            let lngArray = [];

            pois.forEach((poi) => {
               latArray.push(poi.coordinates.lat);
               lngArray.push(poi.coordinates.lng);
            });

            setPoisLatData(latArray);
            setPoisLngData(lngArray);
            setPoisNames(pois);
            setPoisIdNums(poisIds);

            // Set the state variable to true when data is loaded
            setIsLocationsLoaded(true);
         } catch (error) {
            console.log(error);
         }
      };
      fetchRoute();
   }, [location.search]);

   useEffect(() => {
      if (
         poisLatData.length > 0 &&
         poisLngData.length > 0 &&
         poisCoordinatesData > 0
      ) {
         console.log(poisLatData, poisLngData);
         console.log(poisCoordinatesData);
      }
   }, [poisLatData, poisLngData, poisCoordinatesData]);

   //Get POIs from DB
   useEffect(() => {
      const getPoisData = async () => {
         try {
            const response = await axios.get(
               'https://tiys.herokuapp.com/api/pois'
            );
            setPoisData(response.data);
            setIsPoisDataLoaded(true);
         } catch (error) {
            console.log(error);
         }
      };
      getPoisData();
   }, []);

   useEffect(() => {
      //Get route pois' names
      const names = poisNames.map((poi) => poi.name);
      setLocationName(names);
      setIsNamesLoaded(true);
   }, [poisNames, setLocationName]);

   useEffect(() => {
      if (locationName !== undefined) {
         initializeMap();
      }
   }, [locationName]);

   let routePois;

   useEffect(() => {
      //Get AR element
      routePois = poisData.filter((poi) =>
      poisIdNums.includes(poi.poiid)
      );
      const arURLs = routePois.map((arElement) => arElement.arid.url);
      // const ARURLs = poisData.map((item) => item.arid.url);
      setARURLArray(arURLs);
      setIsURLsLoaded(true);
   }, [poisData, setARURLArray]);

   useEffect(() => {
      if (ARURLArray !== undefined) {
         initializeMap();
      }
   }, [ARURLArray]);

   //While data hasn't become an array yet- keep loading
   if (
      !Array.isArray(poisNames) &&
      !Array.isArray(poisIdNums) &&
      !Array.isArray(poisData)
   ) {
      return <div>Loading...</div>;
   }

   const initializeMap = () => {
      navigator.geolocation.getCurrentPosition(function (position) {
         var userPosition = {
           lat: position.coords.latitude,
           lng: position.coords.longitude,
         };
      // Check if locations data is loaded and available
      if (isLocationsLoaded && poisCoordinatesData && poisData !== undefined) {
         const map = new window.google.maps.Map(
            document.getElementById('map'),
            {
               center: { lat: poisLatData[0], lng: poisLngData[0] },
               zoom: 12,
            }
         );
         // Create the start navigation button
         const startNavigationButton = document.createElement('button');
         startNavigationButton.textContent = 'Start';
         startNavigationButton.style.backgroundColor = '#007aff';
         startNavigationButton.style.color = 'white';
         startNavigationButton.style.padding = '10px';
         startNavigationButton.style.borderRadius = '25px'; // change from "50%" to "25px"
         startNavigationButton.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.3)';
         startNavigationButton.style.fontSize = '16px';
         startNavigationButton.style.lineHeight = '1';
         startNavigationButton.style.border = 'none';
         startNavigationButton.style.cursor = 'pointer';
         startNavigationButton.style.marginLeft = '60px';

         // Create the stop navigation button
         const stopNavigationButton = document.createElement('button');
         stopNavigationButton.textContent = 'Stop';
         stopNavigationButton.style.backgroundColor = '#007aff';
         stopNavigationButton.style.color = 'white';
         stopNavigationButton.style.padding = '10px';
         stopNavigationButton.style.borderRadius = '25px'; // change from "50%" to "25px"
         stopNavigationButton.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.3)';
         stopNavigationButton.style.fontSize = '16px';
         stopNavigationButton.style.lineHeight = '1';
         stopNavigationButton.style.border = 'none';
         stopNavigationButton.style.cursor = 'pointer';

         // Create the timer element with white background
         const timerDiv = document.createElement('div');
         timerDiv.innerHTML = '00:00';
         timerDiv.style.backgroundColor = 'white';
         timerDiv.style.padding = '5px';
         timerDiv.style.borderRadius = '5px';
         timerDiv.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.3)';
         timerDiv.style.fontSize = '16px';
         timerDiv.style.marginBottom = '30px';

         // Add the timer element to the map controls
         map.controls[window.google.maps.ControlPosition.TOP_CENTER].push(
            timerDiv
         );

         // Add media query to update marginTop if screen width is greater than 400px
         const mediaQuery = window.matchMedia('(min-width: 600px)');

         function handleMediaQuery(mediaQuery) {
            if (mediaQuery.matches) {
               timerDiv.style.marginTop = '100px';
            } else {
               timerDiv.style.marginTop = '10px';
            }
         }

         // Call the function once to set the initial marginTop
         handleMediaQuery(mediaQuery);

         // Listen for changes in the media query and update marginTop accordingly
         mediaQuery.addEventListener('change', handleMediaQuery);

         let hours = 0;
         let seconds = 0;
         let minutes = 0;
         let timerInterval;
         let totalTime;

         // Add event listener to the stop navigation button
         stopNavigationButton.addEventListener('click', function() {
            // Stop the timer
            clearInterval(timerInterval);
            totalTime = `${hours}:${minutes}:${seconds}`;
            console.log('Total time:', totalTime);

            // Disable the button
            stopNavigationButton.disabled = true;
            stopNavigationButton.style.backgroundColor = '#EEEEEE';
            stopNavigationButton.style.color = 'grey';
            stopNavigationButton.style.cursor = 'default';

            // Show the alert message
            alert('Hope you enjoyed your tour!');
         });

         let savedRoute;
         let isNavigationStarted = false;

         // Add an event listener to the button to start navigation and the timer
         startNavigationButton.addEventListener('click', function() {
            if (savedRoute) {
               directionsRenderer.setDirections(savedRoute);
            } else {
               directionsService.route(request, function(response, status) {
                  if (status == window.google.maps.DirectionsStatus.OK) {
                     savedRoute = response;
                     directionsRenderer.setDirections(response);
                  }
               });
            }

            // Start the timer
            timerInterval = setInterval(function() {
               seconds++;
               if (seconds === 60) {
                  seconds = 0;
                  minutes++;
               }
               if (minutes === 60) {
                  minutes = 0;
                  hours++;
               }
               timerDiv.innerHTML = `${hours < 10 ? '0' + hours : hours}:${
                  minutes < 10 ? '0' + minutes : minutes
               }:${seconds < 10 ? '0' + seconds : seconds}`;
            }, 1000);

            // Disable the button
            startNavigationButton.disabled = true;
            startNavigationButton.style.backgroundColor = '#EEEEEE';
            startNavigationButton.style.color = 'grey';
            startNavigationButton.style.cursor = 'default';
            isNavigationStarted = true;
         });

         const directionsService = new window.google.maps.DirectionsService();
         const directionsRenderer = new window.google.maps.DirectionsRenderer({
           map: map,
           draggable: true,
           suppressMarkers: true, // add this line to suppress markers
         });

         const origin = userPosition;
         const destination = new window.google.maps.LatLng(
           poisLatData[poisLatData.length - 1],
           poisLngData[poisLatData.length - 1]
         );
   
         const waypoints = [];
         for (let i = 0; i < poisLatData.length; i++) {
            waypoints.push({
               location: new window.google.maps.LatLng(
                  poisLatData[i],
                  poisLngData[i]
               ),
               stopover: true,
            });
        }

        const request = {
          origin: origin,
          destination: destination,
          waypoints: waypoints,
          travelMode: window.google.maps.TravelMode.WALKING,
        };

         // const request = {
         //   origin: origin,
         //   destination: destination,
         //   waypoints: [
         //     {
         //       location: new window.google.maps.LatLng(
         //         poisLatData[1],
         //         poisLngData[1]
         //       ),
         //       stopover: true,
         //     },
         //     {
         //       location: new window.google.maps.LatLng(
         //         poisLatData[2],
         //         poisLngData[2]
         //       ),
         //       stopover: true,
         //     },
         //   ],
         //   travelMode: window.google.maps.TravelMode.WALKING,
         // };
         // Create the duration element with white background
         const durationDiv = document.createElement("div");
         durationDiv.style.backgroundColor = "white";
         durationDiv.style.padding = "5px";
         durationDiv.style.borderRadius = "5px";
         durationDiv.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.3)";
         durationDiv.style.fontSize = "16px";
         durationDiv.style.marginBottom = "60px";
   
         // Add the duration element to the map controls
         map.controls[window.google.maps.ControlPosition.BOTTOM_CENTER].push(
           durationDiv
         );
   
         function updateDurationDiv() {
           const response = directionsRenderer.getDirections();
           const durationInSeconds = response.routes[0].legs.reduce(
             (total, leg) => total + leg.duration.value,
             0
           );
   
           let durationString = "";
   
           const durationInMinutes = Math.round(durationInSeconds / 60);
           if (durationInMinutes >= 60) {
             const hours = Math.floor(durationInMinutes / 60);
             const remainingMinutes = durationInMinutes % 60;
             durationString = `${hours}h`;
   
             if (remainingMinutes > 0) {
               durationString += ` ${remainingMinutes}m`;
             }
           } else {
             durationString = `${durationInMinutes}m`;
           }
   
           const eta = new Date(Date.now() + durationInSeconds * 1000);
   
           const distanceInMeters = response.routes[0].legs.reduce(
             (total, leg) => total + leg.distance.value,
             0
           );
           const distanceInKilometers = (distanceInMeters / 1000).toFixed(1);
   
           // Append the buttons to the durationDiv
           durationDiv.innerHTML = `<b>Walking duration:</b> ${durationString}<br><b>Distance:</b> ${distanceInKilometers} km<br><b>ETA:</b> ${eta.toLocaleTimeString(
             [],
             {
               hour: "numeric",
               minute: "numeric",
             }
           )}`;
           durationDiv.appendChild(startNavigationButton);
           durationDiv.appendChild(stopNavigationButton);
         }
   
         directionsService.route(request, function (response, status) {
           if (status == window.google.maps.DirectionsStatus.OK) {
             directionsRenderer.setDirections(response);
             updateDurationDiv();
           }
         });
   
         window.google.maps.event.addListener(
           directionsRenderer,
           "directions_changed",
           function () {
             savedRoute = directionsRenderer.getDirections();
             updateDurationDiv();
           }
         );

         // Create a Marker object for each poi and add an info window
         poisCoordinatesData.forEach((poi, index) => {
            const marker = new window.google.maps.Marker({
               position: { lat: poi.lat, lng: poi.lng },
               map: map,
            });

            const infoWindow = new window.google.maps.InfoWindow({
               content: `<div style="display: flex; justify-content: center; flex-direction: column;">
                           <div style="margin-left: 10px;"><h4>${locationName[index]}</h4></div>
                           <div style="display: flex; justify-content: center; flex-direction: row; margin-left: 5px;">
                           <div style={{backgroundColor: 'transparent', textAlign: 'center'}}>
                                 <a href="${ARURLArray[index]}" target="_blank">
                              <img src="${arIcon}" width='40px' height='40px' alt='${locationName[index]}'>
                              </a>
                           </div>
                           <div>
                           <a href="#" style="text-decoration: none;">
                              <img src=${ranking} style="padding: 7px;" width='25px' height='25px' alt='rankPoi'/>
                              </a>
                           </div>
                           </div>
                        </div>`,
            });
            marker.addListener('click', () => {
               infoWindow.open(map, marker); // open the info window when the marker is clicked
            });
         });

         let userLocationMarker;

         if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
               (position) => {
                  if (userLocationMarker) {
                     // If the userLocationMarker already exists, update its position
                     userLocationMarker.setPosition({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                     });
                  } else {
                     // If the userLocationMarker doesn't exist yet, create it
                     userLocationMarker = new window.google.maps.Marker({
                        position: {
                           lat: position.coords.latitude,
                           lng: position.coords.longitude,
                        },
                        map,
                        icon: {
                           path: window.google.maps.SymbolPath.CIRCLE,
                           fillColor: '#0088FF',
                           fillOpacity: 0.6,
                           strokeColor: '#FFFFFF',
                           strokeWeight: 2,
                           scale: 10,
                        },
                     });
                  }
                  map.setCenter(userLocationMarker.getPosition());
               },
               (error) => {
                  console.log(error);
               },
               { enableHighAccuracy: true }
            );
         }
      }
   })};

   //InitializeMap() is only called after the locations array has been populated with data
   useEffect(() => {
      initializeMap();
   }, [isLocationsLoaded]);

   useEffect(() => {
      // Load the Google Maps API script when the component mounts
      // loadGoogleMapsScript();
      setIsMapLoaded(true);
   }, []);

   return (
      <div id='map' style={{ height: '100vh', width: '100%' }}>
         {/* {isMapLoaded && <LoadScript />} */};
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
