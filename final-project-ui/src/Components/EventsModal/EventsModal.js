import React, { useState, useEffect, useCallback } from 'react';
import styles from './EventsModal.module.css';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const EventsModal = ({ handleCloseModal, handleEventSelection }) => {
   const [open, setOpen] = useState(true);
   const navigate = useNavigate();
   const location = useLocation();
   const theme = useTheme();
   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
   const [events, setEvents] = useState([]); // State to hold the events
   const [isLoading, setIsLoading] = useState(true);
   const [selectedEvents, setSelectedEvents] = useState([]);
   const [isSelectingEvents, setIsSelectingEvents] = useState(false);
   const [title, setTitle] = useState([]);
   const [address, setAddress] = useState([]);
   const [Location, setLocation] = useState([]);
   const [date, setDate] = useState([]);
   const [translatedEvent, setTranslatedEvent] = useState([]);

   const translateText = async (text, targetLanguage) => {
      const apiKey = 'AIzaSyBTcp_fIBVNuxgqiuv4wqyTLfFC6iGm0iE&libraries=places';
      const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
      const response = await fetch(url, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({
            q: text,
            target: targetLanguage,
         }),
      });
      const data = await response.json();
      return data.data.translations[0].translatedText;
   };

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
            })
            .catch((error) => {
               console.error('Error fetching user: ', error);
            });
      }
   }, [location.state]);

   useEffect(() => {
      const fetchEvents = async () => {
         try {
            const response = await axios.get(
               'https://tiy-poc.glitch.me/events.json'
            );
            const translatedEvents = await Promise.all(
               response.data.map(async (event) => {
                  const translatedTitle = await translateText(
                     event.title,
                     'en'
                  );
                  setTitle(translatedTitle);
                  const translatedAddress = await translateText(
                     event.address,
                     'en'
                  );
                  setAddress(translatedAddress);
                  const translatedLocation = await translateText(
                     event.location,
                     'en'
                  );
                  setLocation(translatedLocation);
                  const translatedDate = await translateText(event.date, 'en');
                  setDate(translatedDate);

                  return {
                     ...event,
                     title: translatedTitle,
                     address: translatedAddress,
                     location: translatedLocation,
                     date: translatedDate,
                  };
               })
            );

            const eventsWithCoordinates = await geocodeEvents(response.data);
            setEvents(eventsWithCoordinates);
            setIsLoading(false);
         } catch (error) {
            console.error(error);
         }
      };

      fetchEvents();
   }, []);
   const geocodeEvents = async (events) => {
      const apiKey = 'AIzaSyBTcp_fIBVNuxgqiuv4wqyTLfFC6iGm0iE';

      const geocodeAddress = async (address) => {
         const fullAddress = `${address}, Ramat Gan, Israel`;
         const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            fullAddress
         )}&key=${apiKey}`;

         const response = await axios.get(apiUrl);

         if (response.data.status === 'OK') {
            const { lat, lng } = response.data.results[0].geometry.location;
            return { ...address, lat, lng };
         } else {
            console.log(`Geocoding failed for address: ${address}`);
            return address;
         }
      };
      const geocodedEvents = await Promise.all(
         events.map(async (event) => {
            const geocodedAddress = await geocodeAddress(event.address);
            const coordinates = {
               lat: geocodedAddress.lat,
               lng: geocodedAddress.lng,
            };
            return { ...event, coordinates };
         })
      );

      return geocodedEvents;
   };

   const handleEventClick = (event) => {
      const isSelected = selectedEvents.some(
         (selectedEvent) => selectedEvent.id !== event.id
      );
      let updatedSelectedEvents = [];

      if (isSelected) {
         updatedSelectedEvents = selectedEvents.filter(
            (selectedEvent) => selectedEvent.id !== event.id
         );
      } else {
         updatedSelectedEvents = [...selectedEvents, event];
      }

      setSelectedEvents(updatedSelectedEvents);
      console.log(updatedSelectedEvents);
      setIsSelectingEvents(true);
   };

   const handleEventSelectionComplete = () => {
      setIsSelectingEvents(false);
      // navigate(-1, { state: { selectedEvents } });
      handleEventSelection(selectedEvents);
      handleClose();
   };

   const handleClose = () => {
      handleCloseModal();
   };

   //Modal Style
   const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '70%',
      height: '75%',
      borderRadius: '30px',
      bgcolor: 'background.paper',
      border: '1px solid grey',
      overflow: 'scroll',
      boxShadow: 24,
      p: 4,
   };

   return (
      <div className={styles.modal}>
         <Modal
            open={open}
            onClose={handleCloseModal}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
         >
            <Box sx={style}>
               <div>
                  <section className={styles.modal}>
                     {/* ... */}
                     <Typography
                        component='div'
                        sx={
                           isSmallScreen
                              ? { fontWeight: 'bold', fontSize: '1.25rem' }
                              : { fontWeight: 'bold', fontSize: '1.5rem' }
                        }
                     >
                        <span>Choose Events to add to your Tour:</span>
                     </Typography>
                     <div>
                        <Typography
                           component='div'
                           sx={
                              isSmallScreen
                                 ? {
                                      fontWeight: 'bold',
                                      fontSize: '0.9rem',
                                      mt: 2,
                                   }
                                 : {
                                      fontWeight: 'bold',
                                      fontSize: '1.05rem',
                                      mt: 3,
                                   }
                           }
                        >
                           <span>
                              Scroll down to see events on specific dates
                           </span>
                           {/* {isSelectingEvents && (
                    <Button
                      variant="contained"
                      onClick={() =>
                        navigate(
                          `/map_builder?routeId=1&selectedEvents=${encodeURIComponent(
                            JSON.stringify(selectedEvents)
                          )}`,
                          {
                            state: {
                              token: location.state.token,
                            },
                          }
                        )
                      }
                    >
                      View Selected Events on Map
                    </Button>
                  )} */}
                        </Typography>
                     </div>

                     <Box
                        component='div'
                        sx={{
                           display: 'flex',
                           flexWrap: 'wrap',
                           justifyContent: 'center',
                           mb: 3,
                        }}
                     >
                        {/* <div className={styles.event_card}> */}
                        {/* <div className={styles.inner_card}></div> */}
                        <>
                           {' '}
                           {isSelectingEvents ? (
                              <>
                                 <h3> Selected events: </h3>{' '}
                                 <Button
                                    variant='contained'
                                    onClick={handleEventSelectionComplete}
                                 >
                                    View Selected Events on Map
                                 </Button>
                                 {selectedEvents.map((event, index) => (
                                    <div
                                       key={index}
                                       onClick={() => handleEventClick(event)}
                                       className='event_div selected'
                                    >
                                       <p>
                                          {event.title} <br /> {event.location}
                                          <br />
                                          {event.address} <br />
                                          {event.date}
                                       </p>
                                    </div>
                                 ))}
                                 {events.map(
                                    (event, index) =>
                                       !selectedEvents.includes(event) && (
                                          <div
                                             key={index}
                                             onClick={() =>
                                                handleEventClick(event)
                                             }
                                             className='event_div'
                                          >
                                             <p>
                                                {event.title}
                                                <br /> {
                                                   event.location
                                                } <br /> {event.address} <br />
                                                {/* {event.coordinates.lat}, {event.coordinates.lng} <br />{" "} */}
                                                {event.date}{' '}
                                             </p>
                                          </div>
                                       )
                                 )}{' '}
                              </>
                           ) : (
                              <>
                                 {events.map((event, index) => (
                                    <div
                                       key={index}
                                       onClick={() => handleEventClick(event)}
                                       className={`event_div ${
                                          selectedEvents.includes(event)
                                             ? 'selected'
                                             : ''
                                       }`}
                                    >
                                       <p>
                                          {' '}
                                          {event.title} <br /> {event.location}{' '}
                                          <br /> {event.address}{' '}
                                          {/* <br /> {event.coordinates.lat}, {event.coordinates.lng}{" "} */}
                                          <br /> {event.date}{' '}
                                       </p>{' '}
                                    </div>
                                 ))}{' '}
                              </>
                           )}{' '}
                        </>
                        {/* </div> */}
                     </Box>
                  </section>
                  <div style={{ textAlign: 'center' }}>
                     <Button
                        variant='outlined'
                        sx={{ fontWeight: 'bold', borderRadius: '17px' }}
                        onClick={handleClose}
                     >
                        Close
                     </Button>
                  </div>
               </div>
            </Box>
         </Modal>
      </div>
   );
};

export default EventsModal;
