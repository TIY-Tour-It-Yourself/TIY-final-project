import React, { useState, useEffect } from 'react';
import {
   GoogleMap,
   LoadScript,
   DirectionsService,
   DirectionsRenderer,
} from '@react-google-maps/api';
import axios from 'axios';
import arIcon from './images/ar_icon.png';
import { useLocation } from 'react-router-dom';

const BiyalikMap = (props) => {
   // const { themeSelectedId, selectedLevelId, handleStateChange } = props;
   const [isMapLoaded, setIsMapLoaded] = useState(false);
   const [isLocationsLoaded, setIsLocationsLoaded] = useState(false);
   const [poisData, setPoisData] = useState('');
   const [dataArray, setDataArray] = useState([]);
   const [filteredData, setFilteredData] = useState([]);

   const location = useLocation();

   useEffect(() => {
      const searchParams = new URLSearchParams(location.search);
      const themeSelectedId = searchParams.get('themeSelectedId');
      const selectedLevelId = searchParams.get('selectedLevelId');
      console.log(
         `State variables received: ${themeSelectedId}, ${selectedLevelId}`
      );
      // do something with the state variables
   }, [location.search]);

   // Load the Google Maps API script
   const loadGoogleMapsScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places`;
      script.onload = () => {
         initializeMap();
      };
      document.body.appendChild(script);
   };

   //Get POIs from DB
   //    useEffect(() => {
   //    const filterData = async () => {
   //       try {
   //          // Make an API request to fetch the routes data
   //          const response = await axios.get(
   //             'https://tiys.herokuapp.com/api/pois'
   //          );
   //          setPoisData(response.data);

   //          //Check if ThemeId and ARlevelId were received from Form_Consumer Page
   //          if ({themeSelectedId} && {selectedLevelId}) {
   //             console.log({themeSelectedId}, {selectedLevelId});
   //             // Filter the data based on the selected values
   //             const filtered = response.data.filter((poi) => {
   //                return (
   //                   poi.theme.themeid === themeSelectedId &&
   //                   poi.arid.level === selectedLevelId
   //                );
   //             });
   //             // Update the state with the filtered data
   //             setFilteredData(filtered);
   //             console.log(`filtered: ${filtered.length}`);
   //          } else {
   //             //If either theme or level is not selected, set filtered data to null
   //             setFilteredData(null);
   //          }
   //       } catch (error) {
   //          console.log(error);
   //       }
   //    };

   //    filterData();
   // }, [themeSelectedId, selectedLevelId]);

   //Get POIs from DB
   useEffect(() => {
      const fetchData = async () => {
         try {
            const response = await axios.get(
               'https://tiys.herokuapp.com/api/pois'
            );
            setDataArray(response.data);
            // Set the state variable to true when data is loaded
            setIsLocationsLoaded(true);
         } catch (error) {
            console.log(error);
         }
      };
      fetchData();
   }, []);

   const locations = dataArray.map((item) => item.coordinates);

   useEffect(() => {
      if (locations.length > 0) {
         console.log(locations[0].lat);
      }
   }, [locations]);

   const initializeMap = () => {
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
            travelMode: window.google.maps.TravelMode.WALKING,
         };

         directionsService.route(request, function(response, status) {
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
            marker.addListener('click', () => {
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
      loadGoogleMapsScript();
      setIsMapLoaded(true);
   }, []);

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
      </div>
   );
};

export default BiyalikMap;
