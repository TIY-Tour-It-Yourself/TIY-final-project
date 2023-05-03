import React, { useState, useEffect } from 'react';
import {
   GoogleMap,
   LoadScript,
   DirectionsService,
   DirectionsRenderer,
} from '@react-google-maps/api';
import axios from 'axios';
import arIcon from './images/ar_icon.png';
import ranking from './images/star.png';
import { useLocation, useNavigate } from 'react-router-dom';
import ReviewForm from '../ReviewFormPage/ReviewForm';
import styles from './MapProducer.module.css';

const MapProducer = () => {
   const [isMapLoaded, setIsMapLoaded] = useState(false);
   const [isLocationsLoaded, setIsLocationsLoaded] = useState(false);
   const [dataArray, setDataArray] = useState([]);
   const [poiData, setPoiData] = useState([]);
   const [poiids, setPoiids] = useState([]);
   const [poiDataArray, setPoiDataArray] = useState([]);
   const [locations, setLocations] = useState([]);
   const [names, setNames] = useState([]);
   const [isNamesLoaded, setIsNamesLoaded] = useState(false);
   const [ARElements, setARElements] = useState([]);
   const [isARLoaded, setIsARLoaded] = useState(false);
   const [showForm, setShowForm] = useState(false);
   const [poiValues, setPoiValues] = useState([]);
   const [poiValuesLoaded, setIsPoiValuesLoaded] = useState(false);
   const [selectedPoi, setSelectedPoi] = useState(null);
   const [email, setEmail] = useState('');
   const location = useLocation();
   const navigate = useNavigate();

   useEffect(() => {
      const params = new URLSearchParams(location.search);
      const newPoiids = [];

      const numOfPois = Array.from(params.keys()).filter((k) =>
         k.startsWith('poi')
      ).length;

      for (let i = 1; i <= numOfPois; i++) {
         const poiid = params.get(`poi${i}`);
         newPoiids.push(poiid);
      }

      // get pois from the database
      const fetchData = async () => {
         try {
            const poiDataPromises = newPoiids.map((id) =>
               axios.get(`https://tiys.herokuapp.com/api/pois/${id}`)
            );
            const poiDataResults = await Promise.all(poiDataPromises);
            const poiDataArray = poiDataResults.map((result) => result.data);
            setPoiDataArray(poiDataArray);
         } catch (error) {
            console.error(error);
         }
      };
      fetchData();
   }, [location]);

   // console.log(poiDataArray);
   
   useEffect(() => {
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
               setEmail(response.data.email);
            })
            .catch((error) => {
               console.error('Error fetching user: ', error);
            });
      }
   }, [location.state]);

   //Get Coordinates from POIS
   useEffect(() => {
      if (poiDataArray && poiDataArray.length > 0) {
         const newLocations = poiDataArray.map((item) => item[0].coordinates);
         setLocations(newLocations);
         setIsLocationsLoaded(true); // set isLocationsLoaded to true
      }
   }, [poiDataArray]);

   useEffect(() => {
      if (poiDataArray && poiDataArray.length > 0) {
         const newNames = poiDataArray.map((item) => item[0].name);
         setNames(newNames);
         setIsNamesLoaded(true);
      }
   }, [poiDataArray]);

   useEffect(() => {
      if (poiDataArray && poiDataArray.length > 0) {
         const newAR = poiDataArray.map((item) => item[0].arid.url);
         setARElements(newAR);
         setIsARLoaded(true);
      }
   }, [poiDataArray]);

   // extract POI values from poiDataArray and store them in the state
    useEffect(() => {
      if (poiDataArray && poiDataArray.length > 0) {
         const newPoiValues = poiDataArray.map((item) => item[0].poiid);
         setPoiValues(newPoiValues);
         setIsPoiValuesLoaded(true); // set isPoiValuesLoaded to true
      }
   }, [poiDataArray]);

   // console.log(locations);

   //Open AR Element from ARManagement component
    const openARElement = (poi) => {
      console.log(`function of AR: ${poi}`);
      // const url = `/ar.html?lat=${poi.coordinates.lat}&lng=${poi.coordinates.lng}&desc=${poi.description}&img=${poi.arid.url}`;
      // const url = `/ar_page?lat=${poi.coordinates.lat}&lng=${poi.coordinates.lng}&desc=${poi.description}&img=${poi.arid.url}`;
      // window.location.href = `/ar.html?lat=${poi.coordinates.lat}&lng=${poi.coordinates.lng}&desc=${poi.description}&img=${poi.arid.url}`;
      // window.open(url, '_blank');
   };

   const handleAddReview = (index) => {
      setShowForm(true);
      setSelectedPoi(poiValues[index]);
   }

   const handleCancel = () => {
      setShowForm(false);
   }

   const initializeMap = () => {
      navigator.geolocation.getCurrentPosition(function (position) {
         var userPosition = {
           lat: position.coords.latitude,
           lng: position.coords.longitude,
         };
      // Check if locations data is loaded and available
      if (isLocationsLoaded && locations.length > 0) {
         // Create a map object and center it on the first location
         const map = new window.google.maps.Map(
            document.getElementById('map'),
            {
               center: { lat: locations[0].lat, lng: locations[0].lng },
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

         //Add the timer element to the map controls
         map.controls[window.google.maps.ControlPosition.TOP_CENTER].push(
            timerDiv
         );

         // Add media query to update marginTop if screen width is greater than 400px
         const mediaQuery = window.matchMedia('(min-width: 600px)');

         function handleMediaQuery(mediaQuery) {
            if (mediaQuery.matches) {
               timerDiv.style.marginTop = '100px';
            } else {
               timerDiv.style.marginTop = '52px';
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
            // console.log('Total time:', totalTime);

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

            //disable button
            startNavigationButton.disabled = true;
            startNavigationButton.style.backgroundColor = '#EEEEEE';
            startNavigationButton.style.color = 'grey';
            startNavigationButton.style.cursor = 'default';
            isNavigationStarted = true;
         });

        //Reset button
        const resetButton = document.createElement("button");
        resetButton.innerText = "Reset";
        resetButton.style.backgroundColor = "#007aff";
        resetButton.style.color = "white";
        resetButton.style.padding = "10px";
        resetButton.style.borderRadius = "25px"; // change from "50%" to "25px"
        resetButton.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.3)";
        resetButton.style.fontSize = "16px";
        resetButton.style.lineHeight = "1";
        resetButton.style.border = "none";
        resetButton.style.cursor = "pointer";
 
        resetButton.addEventListener("click", () => {
          directionsRenderer.setDirections(null);
          directionsService.route(request, function (response, status) {
            if (status == window.google.maps.DirectionsStatus.OK) {
              directionsRenderer.setDirections(response);
              updateDurationDiv();
            } else {
              console.log("Directions request failed: " + status);
            }
          });
        });

         const directionsService = new window.google.maps.DirectionsService();
         const directionsRenderer = new window.google.maps.DirectionsRenderer({
            map: map,
            draggable: true,
            suppressMarkers: true, //Suppress default markers
         });

         const origin = userPosition;
         const destination = new window.google.maps.LatLng(
            locations[locations.length - 1].lat,
            locations[locations.length - 1].lng
         );

         const waypoints = [];
         for (let i = 0; i < locations.length; i++) {
            waypoints.push({
               location: new window.google.maps.LatLng(
                  locations[i].lat,
                  locations[i].lng
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

         // Create the duration element with white background
         const durationDiv = document.createElement('div');
         durationDiv.style.backgroundColor = 'white';
         durationDiv.style.padding = '5px';
         durationDiv.style.borderRadius = '5px';
         durationDiv.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.3)';
         durationDiv.style.fontSize = '16px';
         durationDiv.style.marginBottom = '60px';

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
                  hour: 'numeric',
                  minute: 'numeric',
               }
            )}`;
            durationDiv.appendChild(startNavigationButton);
            durationDiv.appendChild(stopNavigationButton);
            durationDiv.appendChild(resetButton);
         }

         // directionsService.route(request, function(response, status) {
         //    if (status == window.google.maps.DirectionsStatus.OK) {
         //       directionsRenderer.setDirections(response);
         //       updateDurationDiv();
         //    }
         // });
         //Arrow location marker
         // directionsService.route(request, function (response, status) {
         //    if (status == window.google.maps.DirectionsStatus.OK) {
         //      directionsRenderer.setDirections(response);
         //      updateDurationDiv();
  
         //      // Get the next step in the route
         //      const nextStep = response.routes[0].legs[0].steps[0];
  
         //      // Create an arrow marker that points in the direction of the next step
         //      const arrowMarker = new window.google.maps.Marker({
         //        position: nextStep.start_location,
         //        icon: {
         //          path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
         //          strokeColor: "#1C6758",
         //          fillColor: "#03C988",
         //          fillOpacity: 1,
         //          scale: 4,
         //        },
         //        map,
         //      });

         // Arrow location marker
         directionsService.route(request, function (response, status) {
            console.log("route created");
            if (status == window.google.maps.DirectionsStatus.OK) {
              directionsRenderer.setDirections(response);
              updateDurationDiv();
  
              // Get the first step in the route
              let nextStep = response.routes[0].legs[0].steps[0];
  
              // Create an arrow marker that points in the direction of the next step
              const arrowMarker = new window.google.maps.Marker({
                position: userPosition,
                icon: {
                  path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                  strokeColor: "#1C6758",
                  fillColor: "#03C988",
                  fillOpacity: 1,
                  scale: 4,
                },
                map,
              });

              // Update the arrow marker whenever the user's location changes
              navigator.geolocation.watchPosition(
               (position) => {
                 const userLocation = new window.google.maps.LatLng(
                   position.coords.latitude,
                   position.coords.longitude
                 );
 
                 // Check if the user has reached the end of the current step
                 if (
                   window.google.maps.geometry.spherical.computeDistanceBetween(
                     userLocation,
                     nextStep.end_location
                   ) < 5
                 ) {
                   // Move to the next step in the route
                   nextStep = response.routes[0].legs[0].steps.find((step) => {
                     return (
                       window.google.maps.geometry.spherical.computeDistanceBetween(
                         userLocation,
                         step.start_location
                       ) < 5
                     );
                   });
 
                   // Rotate the symbol to point in the direction of the next step
                   arrowMarker.setIcon(
                     Object.assign({}, arrowMarker.getIcon(), {
                       rotation:
                         window.google.maps.geometry.spherical.computeHeading(
                           userLocation,
                          //  nextStep.start_location,
                           nextStep.end_location
                         ),
                     })
                   );
                 }
 
                 // Rotate the symbol to point in the direction of the next step
                 arrowMarker.setIcon(
                   Object.assign({}, arrowMarker.getIcon(), {
                     rotation:
                       window.google.maps.geometry.spherical.computeHeading(
                         userLocation,
                         nextStep.end_location
                       ) - position.coords.heading,
                   })
                 );
                 // Move the arrow marker to the new location and center the map
                 arrowMarker.setPosition(userLocation);
                 map.setCenter(userLocation);
               },
               (error) => {
                 console.log(error);
               },
               {
                 enableHighAccuracy: true,
                 timeout: 100,
                 maximumAge: 10000,
               }
             );
           } else {
             console.log("Directions request failed: " + status);
           }
         });
            // Rotate the symbol to point in the direction of the next step
            //   arrowMarker.setIcon(
            //     Object.assign({}, arrowMarker.getIcon(), {
            //       rotation: window.google.maps.geometry.spherical.computeHeading(
            //         nextStep.start_location,
            //         nextStep.end_location
            //       ),
            //     })
            //   );
  
         //      // Update the arrow marker whenever the user's location changes
         //      navigator.geolocation.watchPosition((position) => {
         //        const userLocation = {
         //          lat: position.coords.latitude,
         //          lng: position.coords.longitude,
         //        };
  
         //        // Move the user marker to the new location
         //        // userMarker.setPosition(userLocation);
  
         //        // Rotate the symbol to point in the direction of the next step
         //        arrowMarker.setIcon(
         //          Object.assign({}, arrowMarker.getIcon(), {
         //            rotation:
         //              window.google.maps.geometry.spherical.computeHeading(
         //                userLocation,
         //                nextStep.end_location
         //              ),
         //          })
         //        );
         //      });
         //    } else {
         //      console.log("Directions request failed: " + status);
         //    }
         //  });

         window.google.maps.event.addListener(
            directionsRenderer,
            'directions_changed',
            function() {
               savedRoute = directionsRenderer.getDirections();
               updateDurationDiv();
            }
         );

         // <button id="open-ar-element" style="border: none; background-color: transparent;">
         //  <img src="${arIcon}" width='40px' height='40px' alt='${names[index]}'>
         //    <br/>
         //     <span style="text-decoration: none; font-size: small;">Click Me</span>
         //      </button>

         // <a href="${ARElements[index]}" target="_blank"></a>
         //TBD: need to change to poiDataArray
         // Create a Marker object for each location and add an info window
         locations.forEach((location, index) => {
            const marker = new window.google.maps.Marker({
               position: { lat: location.lat, lng: location.lng },
               map: map,
            });
            const infoWindow = new window.google.maps.InfoWindow({
               content: `<div style="display: flex; justify-content: center; flex-direction: column; margin-left: 22px;">
               <div style="margin: 0 auto;"><h4>${names[index]}</h4></div>
               <div style="display: flex; margin-left: 15px; justify-content: center;">
               <div style="display: flex; flex-direction: column; align-items: center; margin-right: 10px;">
                 <a href="${ARElements[index]}" target="_blank" style="text-decoration: none;">
                   <div>
                     <img src="${arIcon}" width='40px' height='40px' alt='${names[index]}'>
                   </div>
                   <div style="margin-top: 7px;">
                     <span style="text-decoration: none; font-size: small;">Click Me</span>
                   </div>
                 </a> 
               </div>
               <div style="display: flex; flex-direction: column; align-items: center;">
                 <button id="add-review-button" style="border: none; background-color: transparent;">
                   <img src=${ranking} width='40px' height='40px' alt="Add Review" />
                   <div style="margin-top: 5px;">
                     <span style="text-decoration: none; font-size: small;">Rank Me</span>
                   </div>
                 </button>  
               </div>
             </div>
            </div>`,
            });

             infoWindow.addListener("domready", () => {
               const addButton = document.querySelector("#add-review-button");
               addButton.addEventListener("click", () => {
                 handleAddReview(index);
               });
             });

            //Open AR Element
            // const addARButton = document.querySelector("#open-ar-element");
            // addARButton.addEventListener("click", () => {
            //    openARElement(location);
            // });
             
            marker.addListener('click', () => {
               infoWindow.open(map, marker); // open the info window when the marker is clicked
            });
         });

         // let userLocationMarker;

         // if (navigator.geolocation) {
         //    navigator.geolocation.watchPosition(
         //       (position) => {
         //          if (userLocationMarker) {
         //             // If the userLocationMarker already exists, update its position
         //             userLocationMarker.setPosition({
         //                lat: position.coords.latitude,
         //                lng: position.coords.longitude,
         //             });
         //          } else {
         //             // If the userLocationMarker doesn't exist yet, create it
         //             userLocationMarker = new window.google.maps.Marker({
         //                position: {
         //                   lat: position.coords.latitude,
         //                   lng: position.coords.longitude,
         //                },
         //                map,
         //                icon: {
         //                   path: window.google.maps.SymbolPath.CIRCLE,
         //                   fillColor: '#0088FF',
         //                   fillOpacity: 0.6,
         //                   strokeColor: '#FFFFFF',
         //                   strokeWeight: 2,
         //                   scale: 10,
         //                },
         //             });
         //          }
         //          map.setCenter(userLocationMarker.getPosition());
         //       },
         //       (error) => {
         //          console.log(error);
         //       },
         //       { enableHighAccuracy: true }
         //    );
         // }
      }
   })};
   //InitializeMap() is only called after the locations array has been populated with data
   useEffect(() => {
      if (window.google) {
      // if (window.google && email) {
         initializeMap();
      }
   }, [isLocationsLoaded, email]);

   return (
      <div id='map' style={{ height: '100vh', width: '100%' }}>
         {/* {isMapLoaded && <LoadScript />} */}
         {window.google === undefined ? (
            <LoadScript>
               <GoogleMap />
            </LoadScript>
         ) : (
            <GoogleMap />
         )}
         {showForm && (
        <div className={styles.lightbox}>
          <div className={styles.lightbox_content}>
          <button className="close-btn" onClick={handleCancel}>
              X
            </button>
            <ReviewForm 
              onCancel={handleCancel}
              showForm={showForm}
              poiValues={selectedPoi}
            />
          </div>
        </div>
      )}
      </div>
   );
};

export default MapProducer;
