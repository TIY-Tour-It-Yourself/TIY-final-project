import React, { useState, useEffect } from 'react';
import {
   GoogleMap,
   LoadScript,
   DirectionsService,
   DirectionsRenderer,
} from '@react-google-maps/api';
import axios from 'axios';
import arIcon from './images/ar_icon1.png';
import { useLocation } from 'react-router-dom';

const BiyalikMap = (props) => {
   const [isMapLoaded, setIsMapLoaded] = useState(false);
   const [isLocationsLoaded, setIsLocationsLoaded] = useState(false);
   const [poisData, setPoisData] = useState([]);
   const [poisLatData, setPoisLatData] = useState([]);
   const [poisLngData, setPoisLngData] = useState([]);
   const [themeSelectedId, setThemeSelectedId] = useState('');
   const [selectedLevelId, setSelectedLevelId] = useState('');
   const [poisCoordinatesData, setPoisCoordinatesData] = useState([]);
   const [filteredRoutes, setFilteredRoutes] = useState([]);
   const [filteredData, setFilteredData] = useState([]);

   const location = useLocation();
   
   useEffect(() => {
      const searchParams = new URLSearchParams(location.search);
      const routeChosen = searchParams.get('routeChosen');
      
      //Get Route by ID
      const fetchRoute = async () => {
         try {
            const response = await axios.get(
               // `https://tiys.herokuapp.com/api/routes/${routeChosen}`
               `https://tiys.herokuapp.com/api/routes`
               );
               
            //Get route pois
            const pois = response.data[0].pois;
            
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
            
            // Set the state variable to true when data is loaded
            setIsLocationsLoaded(true);
         } catch (error) {
            console.log(error);
         }
      };
      fetchRoute();
   }, [location.search]);
   
   useEffect(() => {
      if (poisLatData.length > 0 && poisLngData.length > 0 && poisCoordinatesData > 0) {
         console.log(poisLatData, poisLngData);
         console.log(poisCoordinatesData);
      }
   }, [poisLatData, poisLngData, poisCoordinatesData]);

   // Load the Google Maps API script
   const loadGoogleMapsScript = () => {
      const script = document.createElement('script');
      // script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_API_KEY}&libraries=places`;
      script.defer = true;
      script.onload = () => {
         initializeMap();
      };
      document.body.appendChild(script);
   };

   //Get POIs from DB
   useEffect(() => {
      const getPoisData = async () => {
         try {
            const response = await axios.get(
               'https://tiys.herokuapp.com/api/pois'
            );
            setPoisData(response.data);
         } catch (error) {
            console.log(error);
         }
      };
      getPoisData();
   }, []);

   let locations, ARURLArray, locationName;

   
   if(isLocationsLoaded) { 
         console.log("loaded");
         locations = poisData.map((item) => item.coordinates);
         // console.log(locations);
         ARURLArray = poisData.map((item) => item.arid.url);
         console.log(ARURLArray);
         locationName = poisData.map((item) => item.name);
         console.log(locationName);
         // const locationDes = poisData.map((item) => item.description);
         // console.log(locationDes);
      }

   const initializeMap = () => {
      // Check if locations data is loaded and available
      if (isLocationsLoaded && poisCoordinatesData) {
         // Create a map object and center it on the first location
         const map = new window.google.maps.Map(
            document.getElementById('map'),
            {
               center: { lat: poisLatData[0], lng: poisLngData[0] },
               zoom: 12,
            }
         );
         const directionsService = new window.google.maps.DirectionsService();
         const directionsRenderer = new window.google.maps.DirectionsRenderer({
            map: map,
            suppressMarkers: true, // add this line to suppress markers
         });
         const origin = new window.google.maps.LatLng(
            poisLatData[0],
            poisLngData[0]
         );
         const destination = new window.google.maps.LatLng(
            poisLatData[poisLatData.length-1],
            poisLngData[poisLatData.length-1]
         );

         const request = {
            origin: origin,
            destination: destination,
            waypoints: [
               {
                  location: new window.google.maps.LatLng(
                     poisLatData[1],
                     poisLngData[1]
                  ),
                  stopover: true,
               },
               {
                  location: new window.google.maps.LatLng(
                     poisLatData[2],
                     poisLngData[2]
                  ),
                  stopover: true,
               },
            ],
            travelMode: window.google.maps.TravelMode.WALKING,
         };

         directionsService.route(request, function(response, status) {
            if (status == window.google.maps.DirectionsStatus.OK) {
               directionsRenderer.setDirections(response);
            }
         });

         // Create a Marker object for each poi and add an info window
         poisCoordinatesData.forEach((poi) => {
            const marker = new window.google.maps.Marker({
               position: { lat: poi.lat, lng: poi.lng },
               map: map,
            });

            // ARURLArray.forEach((arUrl) => {
            //    const infoWindow = new window.google.maps.InfoWindow({
            //      content: location.name, // set the content of the info window
            //    });
     

            const infoWindow = new window.google.maps.InfoWindow({
               content: location.name, // set the content of the info window
            });
            
            marker.addListener('click', () => {
               infoWindow.open(map, marker); // open the info window when the marker is clicked
            });
         });

         poisCoordinatesData.forEach((poi, index) => {
            const marker = new window.google.maps.Marker({
              position: { lat: poi.lat, lng: poi.lng },
              map: map,
            });

            const infoWindow = new window.google.maps.InfoWindow({
               content: `<div style={{display: 'flex', justifyContent: 'center' , border: '2px solid black'}}>
                                    <h4>${locationName[index]}</h4>
                        
                                    <div style={{backgroundColor: 'transparent', textAlign: 'center'}}>
                                       <a href="${ARURLArray[index]}" target="_blank">
                                       <img src="${arIcon}" width='40px' height='40px' alt='${locationName[index]}'>
                                       </a>
                                    </div>
                        </div>`,
             });
     
             marker.addListener("click", () => {
               infoWindow.open(map, marker);
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
                     fillColor: '#0088FF',
                     fillOpacity: 0.6,
                     strokeColor: '#FFFFFF',
                     strokeWeight: 2,
                     scale: 10,
                  },
               });
               map.setCenter(userLocationMarker.getPosition());
            });
         }
      }
   };

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
