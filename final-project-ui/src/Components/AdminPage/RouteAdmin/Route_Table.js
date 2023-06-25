import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import Add_Route from './Add_Route';
import Update_Route from './Update_Route';
import styles from './Route_Table.module.css';
import NavBarExternal from '../../Additionals/NavBarExternal/NavBarExternal';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Pagination } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function MyComponent(props) {
   const [admin, setAdmin] = useState('');
   const [routes, setRoutes] = useState([]);
   const [showAddForm, setAddShowForm] = useState(false);
   const [showUpdateForm, setUpdateShowForm] = useState(false);
   const [selectedRoute, setSelectedRoute] = useState(null);
   const [routeid, setRouteid] = useState(0);
   const [lastRouteid, setLastRouteid] = useState(0);
   const [activeImage, setActiveImage] = useState(null);
   const location = useLocation();
   const navigate = useNavigate();
   const [selectedRowData, setSelectedRowData] = useState([]);

   const isSmallScreen = useMediaQuery('(max-width: 600px)');
   const pageSize = 1;
   const [currentPage, setCurrentPage] = useState(1);

   const startIndex = (currentPage - 1) * pageSize;
   const endIndex = startIndex + pageSize;
   const paginatedRoutes = routes.slice(startIndex, endIndex);

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
               setAdmin(location.state.userRole);
            })
            .catch((error) => {
               console.error('Error fetching user: ', error);
            });
      }
   }, [location.state]);

   useEffect(() => {
      async function fetchData() {
         const response = await axios.get(
            'https://tiys.herokuapp.com/api/routes'
         );
         setRoutes(response.data);
      }

      fetchData();
   }, []);

   useEffect(() => {
      if (selectedRoute !== null) {
      }
   }, [selectedRoute]);

   var routeLength = routes.length - 1;

   const handlePageChange = (event, value) => {
      setCurrentPage(value);
   };

   function handleAddRoute(id) {
      setAddShowForm(true);
      if (routes.length > 0) {
         setLastRouteid(routes[routeLength].routeid);
      }
   }

   function handleCancelAdd() {
      setAddShowForm(false);
   }

   function handleCancelUpdate() {
      setUpdateShowForm(false);
   }
   const handleGoBack = () => {
      navigate(-1); // Go back to the previous page
   };

   function handleUpdate(routeid) {
      const selected = routes.find((route) => route.routeid === routeid);
      setSelectedRoute(selected);
      setUpdateShowForm(true);
   }

   async function handleDelete(ids) {
      // Ask for confirmation before deleting
      const isConfirmed = window.confirm('Are you sure you want to delete?');

      if (isConfirmed) {
         try {
            for (const id of ids) {
               const response = await axios.delete(
                  'https://tiys.herokuapp.com/api/routes',
                  {
                     data: {
                        routeid: id,
                     },
                  }
               );
               console.log(`Successfully deleted route with ID ${id}`);
               window.location.reload();
            }
         } catch (error) {
            console.error('Error deleting routes:', error);
         }
      } else {
         console.log('Deletion canceled');
      }
   }

   // Find the route with the most POIs
   const mostPoisRoute = routes.reduce((prev, current) => {
      return prev && prev.pois.length > current.pois.length ? prev : current;
   }, null);

   //   Generate columns based on the number of POIs in the mostPoisRoute
   let poiColumns = [];
   if (mostPoisRoute && mostPoisRoute.pois && mostPoisRoute.pois.length > 0) {
      poiColumns = Array.from(
         { length: mostPoisRoute.pois.length },
         (_, i) => ({
            field: `pois[${i}].name`,
            headerName: `POI ${i + 1}`,
            flex: 1,
            valueGetter: (params) => params.row.pois.map((poi) => poi.name)[i],
         })
      );
   }

   const columns = [
      {
         field: 'description',
         headerName: 'Description',
         flex: 1,
      },
      {
         field: 'poiid',
         headerName: 'POI IDs',
         flex: 1,
         valueGetter: (params) =>
            params.row.pois.map((poi) => poi.poiid).join(', '),
         headerAlign: 'center',
         align: 'center',
      },
      {
         field: 'evaluation_grade',
         headerName: 'Evaluation Grade',
         flex: 1,
         type: 'number',
         headerAlign: 'center',
         align: 'center',
      },
      {
         field: 'experience_level',
         headerName: 'Experience Level',
         flex: 1,
         headerAlign: 'center',
         align: 'center',
      },
      {
         field: 'theme.theme',
         headerName: 'Theme',
         flex: 1,
         valueGetter: (params) => params.row.theme.theme,
         headerAlign: 'center',
         align: 'center',
      },
      { field: 'imgurl', headerName: 'Imgurl', flex: 1 },
      {
         field: 'update',
         headerName: '',
         flex: 0.5,
         renderCell: (params) => (
            <Button
               variant='contained'
               onClick={() => handleUpdate(params.row.routeid)}
            >
               Update{' '}
            </Button>
         ),
      },
   ];

   function handleDeleteSelected() {
      const selectedIDs = routes
         .filter((route) => route._selected)
         .map((route) => route._id);
      handleDelete(selectedIDs);
   }
   return (
      <>
         <NavBarExternal userRole={admin} />
         <div className={styles.route_table_body}>
            {isSmallScreen ? (
               <div>
                  <IconButton
                     color='primary'
                     aria-label='Go Back'
                     onClick={handleGoBack}
                     style={{
                        position: 'absolute',
                        left: '10px',
                        marginTop: '450px',
                     }}
                  >
                     <ArrowBackIcon />
                  </IconButton>
                  {paginatedRoutes.map((route) => (
                     <Card
                        key={route.routeid}
                        style={{
                           width: '300px', // Adjust the width as needed
                           border: '1px solid black',
                           boxShadow: '2px 4px 8px rgba(0, 0, 0, 0.8)',
                           margin: '0 auto', // Center the card horizontally
                        }}
                     >
                        <CardContent>
                           <div
                              style={{
                                 display: 'flex',
                                 alignItems: 'center',
                                 justifyContent: 'center',
                                 height: '140px',
                                 overflow: 'hidden',
                              }}
                           >
                              <img
                                 src={route.imgurl}
                                 alt='Avatar'
                                 style={{ maxWidth: '100%', height: '150px' }}
                              />
                           </div>
                           <Typography>
                              <b>Description: </b>
                              {route.description}
                           </Typography>
                           <Typography>
                              <b>Pois:</b>{' '}
                              {Array.isArray(route.pois)
                                 ? route.pois.map((poi) => poi.poiid).join(', ')
                                 : ''}
                           </Typography>
                           <Typography>
                              <b>Evaluation Grade:</b> {route.evaluation_grade}
                           </Typography>
                           <Typography>
                              <b>Experience Level:</b> {route.experience_level}
                           </Typography>
                           <Typography>
                              <b>Theme:</b> {route.theme.theme}
                           </Typography>
                        </CardContent>

                        <div
                           style={{
                              display: 'flex',
                              justifyContent: 'center',
                              height: '100%',
                              marginTop: '20px',
                              marginBottom: '40px',
                           }}
                        >
                           <Button
                              variant='contained'
                              onClick={() => handleUpdate(route.routeid)}
                              style={{
                                 flex: 1,
                                 maxWidth: '140px',
                                 marginLeft: '5px',
                                 marginRight: '5px',
                              }}
                           >
                              Update
                           </Button>
                           <Button
                              variant='contained'
                              onClick={() => handleDelete(route.routeid)}
                              style={{
                                 backgroundColor: '#d91d0f',
                                 color: 'white',
                                 flex: 1,
                                 maxWidth: '140px',
                                 marginLeft: '5px',
                                 marginRight: '5px',
                              }}
                           >
                              Delete
                           </Button>
                        </div>
                     </Card>
                  ))}
                  <div
                     style={{
                        display: 'flex',
                        justifyContent: 'center',
                     }}
                  >
                     <Pagination
                        count={Math.ceil(routes.length / pageSize)}
                        page={currentPage}
                        onChange={handlePageChange}
                     />
                  </div>
                  <div
                     style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '20px',
                     }}
                  >
                     <Button variant='contained' onClick={handleAddRoute}>
                        Add New Route
                     </Button>
                  </div>
               </div>
            ) : (
               <>
                  <div
                     style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100px',
                        position: 'relative',
                     }}
                  >
                     <IconButton
                        color='primary'
                        aria-label='Go Back'
                        onClick={handleGoBack}
                        style={{
                           position: 'absolute',
                           left: '10px',
                           marginTop: '35px',
                        }}
                     >
                        <ArrowBackIcon />
                     </IconButton>
                     <h1 style={{ marginTop: '50px' }}>Routes Table</h1>
                  </div>
                  <div
                     style={{ height: 500, width: '100%', marginTop: '10px' }}
                  >
                     <DataGrid
                        slots={{
                           toolbar: GridToolbar,
                        }}
                        rows={routes.map((route) => ({
                           ...route,
                           id: route.routeid,
                           grade: route.evaluation_grade.toFixed(2),
                        }))}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        style={{ fontSize: '14px' }}
                        checkboxSelection
                        onRowSelectionModelChange={(selectedpoi) => {
                           setSelectedRowData(selectedpoi);
                        }}
                     />
                     <div
                        style={{
                           display: 'flex',
                           justifyContent: 'center',
                           marginTop: '20px',
                        }}
                     >
                        <Button variant='contained' onClick={handleAddRoute}>
                           Add New Route
                        </Button>
                        <Button
                           variant='contained'
                           onClick={() => handleDelete(selectedRowData)}
                           style={{
                              backgroundColor: '#d91d0f',
                              color: 'white',
                              marginLeft: '10px',
                           }}
                        >
                           Delete Route
                        </Button>
                     </div>
                  </div>
               </>
            )}
            {showAddForm && (
               <div
                  className={styles.lightbox}
                  style={{ maxWidth: isSmallScreen ? '100%' : 'auto' }}
               >
                  <div
                     className={styles.lightboxContent}
                     style={{
                        marginTop: '320px',
                        maxWidth: isSmallScreen ? '100%' : 'auto',
                     }}
                  >
                     <Button
                        // variant="contained"
                        className='close-button'
                        onClick={handleCancelAdd}
                     >
                        X
                     </Button>
                     <Add_Route
                        lastRouteId={lastRouteid}
                        onCancel={handleCancelAdd}
                     />
                  </div>
               </div>
            )}

            {showUpdateForm && (
               <div
                  className={styles.lightbox}
                  style={{ maxWidth: isSmallScreen ? '100%' : 'auto' }}
               >
                  <div
                     className={styles.lightboxContent}
                     style={{
                        marginTop: '250px',
                        maxWidth: isSmallScreen ? '100%' : 'auto',
                     }}
                  >
                     <Button
                        className='close-button'
                        onClick={handleCancelUpdate}
                        style={{ marginTop: '120px' }}
                     >
                        X
                     </Button>
                     <Update_Route
                        onCancel={handleCancelUpdate}
                        selectedRoute={selectedRoute}
                     />
                  </div>
               </div>
            )}
         </div>
      </>
   );
}

export default MyComponent;
