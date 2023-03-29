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
import { useLocation } from 'react-router-dom';

const Map_Producer = () => {
   const [isMapLoaded, setIsMapLoaded] = useState(false);
   const [isLocationsLoaded, setIsLocationsLoaded] = useState(false);
   const [dataArray, setDataArray] = useState([]);
   const location = useLocation();
   const [poiData, setPoiData] = useState([]);
   const [poiids, setPoiids] = useState([]);
   const [poiDataArray, setPoiDataArray] = useState([]);
   const [locations, setLocations] = useState([]);
   const [names, setNames] = useState([]);
   // const [locationName, setLocationName] = useState('');
   const [isNamesLoaded, setIsNamesLoaded] = useState(false);
   const [ARElements, setARElements] = useState([]);
   const [isARLoaded, setIsARLoaded] = useState(false);

   useEffect(() => {
      const params = new URLSearchParams(location.search);
      const newPoiids = [];

      for (let i = 1; i <= 4; i++) {
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
            // console.log(poiDataResults);
            const poiDataArray = poiDataResults.map((result) => result.data);
            setPoiDataArray(poiDataArray);
         } catch (error) {
            console.error(error);
         }
      };
      fetchData();
   }, [location]);

   // get coordinates from pois
   useEffect(() => {
      // console.log(poiDataArray);
      if (poiDataArray && poiDataArray.length > 0) {
         const newLocations = poiDataArray
            .slice(0, 4)
            .map((item) => item[0].coordinates);
         // console.log(newLocations);
         setLocations(newLocations);
         setIsLocationsLoaded(true); // set isLocationsLoaded to true
      }
   }, [poiDataArray]);

   useEffect(() => {
      if (poiDataArray && poiDataArray.length > 0) {
         const newNames = poiDataArray.slice(0, 4).map((item) => item[0].name);
         setNames(newNames);
         setIsNamesLoaded(true);
      }
   }, [poiDataArray]);

   // console.log(names);
   useEffect(() => {
      if (poiDataArray && poiDataArray.length > 0) {
         const newAR = poiDataArray.slice(0, 4).map((item) => item[0].arid.url);
         setARElements(newAR);
         setIsARLoaded(true);
      }
   }, [poiDataArray]);
   // console.log(ARElements);
   // console.log(locations);

      // useEffect(() => {
   //    const names = poisData.map(item => item.name);
   //    setLocationName(names);
   //    setIsNamesLoaded(true);
   // },[poisData, locationName]);

   // useEffect(() => {
   //    if(locationName !== undefined) {
   //       initializeMap();
   //    }
   // }, [locationName]);

   // useEffect(() => {
   //    if(ARURL !== undefined) {
   //       initializeMap();
   //    }
   // }, [ARURL]);

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
            locations[locations.length - 1].lat,
            locations[locations.length - 1].lng
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
         locations.forEach((location, index) => {
            const marker = new window.google.maps.Marker({
               position: { lat: location.lat, lng: location.lng },
               map: map,
            });

            const infoWindow = new window.google.maps.InfoWindow({
               content: `<div style="display: flex; justify-content: center; flex-direction: column;">
                                    <div style="margin-left: 10px;"><h4>${names[index]}</h4></div>
                                  <div style="display: flex; justify-content: center; flex-direction: row; margin-left: 5px;">
                                    <div style={{backgroundColor: 'transparent', textAlign: 'center'}}>
                                        <a href="${ARElements[index]}" target="_blank">
                                       <img src="${arIcon}" width='40px' height='40px' alt='${names[index]}'>
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

         // Create a Marker object for the current user location
         // if (navigator.geolocation) {
         //    navigator.geolocation.getCurrentPosition((position) => {
         //       const userLocationMarker = new window.google.maps.Marker({
         //          position: {
         //             lat: position.coords.latitude,
         //             lng: position.coords.longitude,
         //          },
         //          map,
         //          icon: {
         //             path: window.google.maps.SymbolPath.CIRCLE,
         //             fillColor: '#0088FF',
         //             fillOpacity: 0.6,
         //             strokeColor: '#FFFFFF',
         //             strokeWeight: 2,
         //             scale: 10,
         //          },
         //       });
         //       map.setCenter(userLocationMarker.getPosition());
         //    });
         // }

      let userLocationMarker;

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
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
                fillColor: "#0088FF",
                fillOpacity: 0.6,
                strokeColor: "#FFFFFF",
                strokeWeight: 2,
                scale: 10,
              },
            });
          }
          map.setCenter(userLocationMarker.getPosition());
        });
      }
      }
   };
   //InitializeMap() is only called after the locations array has been populated with data
   useEffect(() => {
      if (window.google) {
         initializeMap();
      }
   }, [isLocationsLoaded]);

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

export default Map_Producer;
