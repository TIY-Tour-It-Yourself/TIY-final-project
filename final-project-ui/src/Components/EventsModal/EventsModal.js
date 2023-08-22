import React, { useState, useEffect } from 'react';
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
      const apiKey = 'AIzaSyDTDJ58Mo7LFA3vStk4Ze3qBPu_yIvXqRQ';

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
      setIsSelectingEvents(true);
   };

   const handleEventSelectionComplete = () => {
      setIsSelectingEvents(false);
      handleEventSelection(selectedEvents);
      handleClose();
   };

   const handleClose = () => {
      handleCloseModal();
   };

   //Modal Style
   const style = {
      position: 'absolute',
      top: '50vh',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: isSmallScreen ? '70%' : '40%', // Adjust the width based on the screen size
      height: '75%',
      borderRadius: '30px',
      bgcolor: 'background.paper',
      border: '1px solid grey',
      overflow: 'scroll',
      boxShadow: 24,
      p: 4,
   };

   function sortEventsByDate(events) {
      return events.sort((a, b) => {
         if (!a.date && !b.date) {
            return 0;
         }
         if (!a.date) {
            return 1;
         }
         if (!b.date) {
            return -1;
         }

         // Extract the start dates from the event dates
         const startDateA = a.date.split('-')[0];
         const startDateB = b.date.split('-')[0];

         // Convert start dates to a sortable format (mm/dd)
         const sortableDateA = `${startDateA.slice(3, 5)}/${startDateA.slice(
            0,
            2
         )}`;
         const sortableDateB = `${startDateB.slice(3, 5)}/${startDateB.slice(
            0,
            2
         )}`;

         // Compare the sortable start dates
         if (sortableDateA < sortableDateB) return -1;
         if (sortableDateA > sortableDateB) return 1;

         // Handle the case of "dd/mm-dd/mm"
         if (a.date.includes('-') && b.date.includes('-')) {
            const endDateA = a.date.split('-')[1];
            const endDateB = b.date.split('-')[1];
            const sortableEndDateA = `${endDateA.slice(3, 5)}/${endDateA.slice(
               0,
               2
            )}`;
            const sortableEndDateB = `${endDateB.slice(3, 5)}/${endDateB.slice(
               0,
               2
            )}`;

            if (sortableEndDateA < sortableEndDateB) return -1;
            if (sortableEndDateA > sortableEndDateB) return 1;
         }

         return 0;
      });
   }

   const handleEventClickInverse = (event) => {
      const index = selectedEvents.findIndex(
         (selectedEvent) => selectedEvent.title === event.title
      );
      if (index !== -1) {
         setSelectedEvents(
            selectedEvents
               .slice(0, index)
               .concat(selectedEvents.slice(index + 1))
         );
      }
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
                     <Typography
                        component='div'
                        sx={
                           isSmallScreen
                              ? { fontWeight: 'bold', fontSize: '1.25rem' }
                              : { fontWeight: 'bold', fontSize: '1.5rem' }
                        }
                     >
                        <span>Choose Events To Add To Your Tour</span>
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
                        </Typography>
                     </div>

                     <Box
                        component='div'
                        sx={
                           ({
                              display: 'flex',
                              flexWrap: 'wrap',
                              justifyContent: 'center',
                              mb: 3,
                           },
                           !isSmallScreen ? { width: '100%' } : {})
                        }
                     >
                        <>
                           {isSelectingEvents ? (
                              <>
                                 <div>
                                    <Button
                                       variant='contained'
                                       onClick={handleEventSelectionComplete}
                                       style={{
                                          fontWeight: 'bold',
                                          borderRadius: '5%',
                                          height: '30px',
                                          width: '160px',
                                          padding: 0,
                                       }}
                                    >
                                       Back To Form
                                    </Button>
                                 </div>
                                 <div className={styles.selected_events}>
                                    <ul>
                                       {selectedEvents
                                          .sort((a, b) => {
                                             if (!a.date && !b.date) {
                                                return 0;
                                             }
                                             if (!a.date) {
                                                return 1;
                                             }
                                             if (!b.date) {
                                                return -1;
                                             }

                                             // Extract the start dates from the event dates
                                             const startDateA = a.date.split(
                                                '-'
                                             )[0];
                                             const startDateB = b.date.split(
                                                '-'
                                             )[0];

                                             // Convert start dates to a sortable format (mm/dd)
                                             const sortableDateA = `${startDateA.slice(
                                                3,
                                                5
                                             )}/${startDateA.slice(0, 2)}`;
                                             const sortableDateB = `${startDateB.slice(
                                                3,
                                                5
                                             )}/${startDateB.slice(0, 2)}`;

                                             // Compare the sortable start dates
                                             if (sortableDateA < sortableDateB)
                                                return -1;
                                             if (sortableDateA > sortableDateB)
                                                return 1;

                                             // Handle the case of "dd/mm-dd/mm"
                                             if (
                                                a.date.includes('-') &&
                                                b.date.includes('-')
                                             ) {
                                                const endDateA = a.date.split(
                                                   '-'
                                                )[1];
                                                const endDateB = b.date.split(
                                                   '-'
                                                )[1];
                                                const sortableEndDateA = `${endDateA.slice(
                                                   3,
                                                   5
                                                )}/${endDateA.slice(0, 2)}`;
                                                const sortableEndDateB = `${endDateB.slice(
                                                   3,
                                                   5
                                                )}/${endDateB.slice(0, 2)}`;

                                                if (
                                                   sortableEndDateA <
                                                   sortableEndDateB
                                                )
                                                   return -1;
                                                if (
                                                   sortableEndDateA >
                                                   sortableEndDateB
                                                )
                                                   return 1;
                                             }

                                             return 0;
                                          })
                                          .map((event, index) => (
                                             <li
                                                key={index}
                                                onClick={() =>
                                                   handleEventClickInverse(
                                                      event
                                                   )
                                                }
                                                className={
                                                   styles.deselect_events
                                                }
                                             >
                                                <p>
                                                   <b>{event.title}</b> <br />
                                                   {event.location}
                                                   <br />
                                                   {event.address} <br />
                                                   {event.date}
                                                </p>
                                             </li>
                                          ))}
                                    </ul>

                                    <ul style={{ marginRight: '40px' }}>
                                       {events
                                          .sort((a, b) => {
                                             if (!a.date && !b.date) {
                                                return 0;
                                             }
                                             if (!a.date) {
                                                return 1;
                                             }
                                             if (!b.date) {
                                                return -1;
                                             }

                                             // Extract the start dates from the event dates
                                             const startDateA = a.date.split(
                                                '-'
                                             )[0];
                                             const startDateB = b.date.split(
                                                '-'
                                             )[0];

                                             // Convert start dates to a sortable format (mm/dd)
                                             const sortableDateA = `${startDateA.slice(
                                                3,
                                                5
                                             )}/${startDateA.slice(0, 2)}`;
                                             const sortableDateB = `${startDateB.slice(
                                                3,
                                                5
                                             )}/${startDateB.slice(0, 2)}`;

                                             // Compare the sortable start dates
                                             if (sortableDateA < sortableDateB)
                                                return -1;
                                             if (sortableDateA > sortableDateB)
                                                return 1;

                                             // Handle the case of "dd/mm-dd/mm"
                                             if (
                                                a.date.includes('-') &&
                                                b.date.includes('-')
                                             ) {
                                                const endDateA = a.date.split(
                                                   '-'
                                                )[1];
                                                const endDateB = b.date.split(
                                                   '-'
                                                )[1];
                                                const sortableEndDateA = `${endDateA.slice(
                                                   3,
                                                   5
                                                )}/${endDateA.slice(0, 2)}`;
                                                const sortableEndDateB = `${endDateB.slice(
                                                   3,
                                                   5
                                                )}/${endDateB.slice(0, 2)}`;

                                                if (
                                                   sortableEndDateA <
                                                   sortableEndDateB
                                                )
                                                   return -1;
                                                if (
                                                   sortableEndDateA >
                                                   sortableEndDateB
                                                )
                                                   return 1;
                                             }

                                             return 0;
                                          })
                                          .map(
                                             (event, index) =>
                                                !selectedEvents.includes(
                                                   event
                                                ) && (
                                                   <li
                                                      key={index}
                                                      onClick={() =>
                                                         handleEventClick(event)
                                                      }
                                                      className={
                                                         styles.event_list_item
                                                      }
                                                   >
                                                      <p>
                                                         <b> {event.title}</b>
                                                         <br /> {
                                                            event.location
                                                         }{' '}
                                                         <br /> {event.address}
                                                         <br />
                                                         {event.date}{' '}
                                                      </p>
                                                   </li>
                                                )
                                          )}
                                    </ul>
                                 </div>
                              </>
                           ) : (
                              <>
                                 <ul style={{ marginRight: '40px' }}>
                                    {events
                                       .sort((a, b) => {
                                          if (!a.date && !b.date) {
                                             return 0;
                                          }
                                          if (!a.date) {
                                             return 1;
                                          }
                                          if (!b.date) {
                                             return -1;
                                          }

                                          // Extract the start dates from the event dates
                                          const startDateA = a.date.split(
                                             '-'
                                          )[0];
                                          const startDateB = b.date.split(
                                             '-'
                                          )[0];

                                          // Convert start dates to a sortable format (mm/dd)
                                          const sortableDateA = `${startDateA.slice(
                                             3,
                                             5
                                          )}/${startDateA.slice(0, 2)}`;
                                          const sortableDateB = `${startDateB.slice(
                                             3,
                                             5
                                          )}/${startDateB.slice(0, 2)}`;

                                          // Compare the sortable start dates
                                          if (sortableDateA < sortableDateB)
                                             return -1;
                                          if (sortableDateA > sortableDateB)
                                             return 1;

                                          // Handle the case of "dd/mm-dd/mm"
                                          if (
                                             a.date.includes('-') &&
                                             b.date.includes('-')
                                          ) {
                                             const endDateA = a.date.split(
                                                '-'
                                             )[1];
                                             const endDateB = b.date.split(
                                                '-'
                                             )[1];
                                             const sortableEndDateA = `${endDateA.slice(
                                                3,
                                                5
                                             )}/${endDateA.slice(0, 2)}`;
                                             const sortableEndDateB = `${endDateB.slice(
                                                3,
                                                5
                                             )}/${endDateB.slice(0, 2)}`;

                                             if (
                                                sortableEndDateA <
                                                sortableEndDateB
                                             )
                                                return -1;
                                             if (
                                                sortableEndDateA >
                                                sortableEndDateB
                                             )
                                                return 1;
                                          }

                                          return 0;
                                       })
                                       .map((event, index) => (
                                          <li
                                             key={index}
                                             onClick={() =>
                                                handleEventClick(event)
                                             }
                                             className={`${
                                                styles.event_list_item
                                             } ${
                                                selectedEvents.includes(event)
                                                   ? styles.selected
                                                   : ''
                                             }`}
                                          >
                                             <b> {event.title}</b> <br />
                                             {event.location}
                                             <br />
                                             {event.address} <br />
                                             {event.date}
                                          </li>
                                       ))}{' '}
                                 </ul>
                                 {/* </div> */}
                              </>
                           )}{' '}
                        </>
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
