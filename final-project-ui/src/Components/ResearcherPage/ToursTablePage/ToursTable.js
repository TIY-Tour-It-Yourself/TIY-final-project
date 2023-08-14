import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import styles from './ToursTable.module.css';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useLocation, useNavigate } from 'react-router-dom';
import { Typography, Box, Pagination } from '@mui/material';
import NavBarExternal from '../../Additionals/NavBarExternal/NavBarExternal';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const columns = [
   { field: 'routeid', headerName: 'Tour ID', width: 90, sortable: true },
   {
      field: 'description',
      headerName: 'Tour Name',
      width: 250,
      sortable: true,
   },
   {
      field: 'theme',
      headerName: 'Tour Theme',
      width: 150,
      sortable: true,
   },
   {
      field: 'experience_level',
      headerName: 'AR Level',
      width: 100,
      sortable: true,
      headerAlign: 'center',
      align: 'center',
   },
   {
      field: 'pois',
      headerName: 'POI Amount',
      width: 150,
      sortable: true,
      headerAlign: 'center',
      align: 'center',
   },
   {
      field: 'evaluation_grade',
      headerName: 'Evaluation Grade',
      type: 'number',
      width: 180,
      sortable: true,
      headerAlign: 'center',
      align: 'center',
   },
   {
      field: 'duration',
      headerName: 'Tour Duration',
      sortable: true,
      width: 150,
      headerAlign: 'center',
      align: 'center',
   },
   {
      field: 'type',
      headerName: 'Consumer / Producer',
      sortable: true,
      width: 210,
      headerAlign: 'center',
      align: 'center',
   },
];

const columnsSecond = [
   {
      field: 'poiid',
      headerName: 'Poi ID',
      width: 90,
      sortable: true,
   },
   {
      field: 'name',
      headerName: 'Poi Name',
      width: 150,
      sortable: true,
   },
   {
      field: 'grade',
      headerName: 'Poi Grade',
      width: 150,
      sortable: true,
   },
   {
      field: 'email',
      headerName: 'User Ranked',
      width: 200,
      sortable: true,
      headerAlign: 'center',
      align: 'center',
   },
];

const ToursTable = ({ userRole }) => {
   const location = useLocation();
   const navigate = useNavigate();
   const [user, setUser] = useState(userRole);
   const [activeImage, setActiveImage] = useState('');
   const [tours, setTours] = useState([]);
   const [routeTheme, setRouteThemes] = useState([]);
   const [selectedRowData, setSelectedRowData] = useState([]);
   const [poisGrades, setPoisGrades] = useState([]);
   const [poisIds, setPoisIds] = useState([]);
   const [cardPoisIds, setCardPoisIds] = useState([]);
   const [filteredData, setFilteredData] = useState('');
   const [currentPage, setCurrentPage] = useState(1);
   const [selectedCard, setSelectedCard] = useState(null);
   const [selectedCardData, setSelectedCardData] = useState(null);
   const theme = useTheme();
   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

   //Manipulation of Pagination on Responsive Display
   const pageSize = 1;
   const startIndex = (currentPage - 1) * pageSize;
   const endIndex = startIndex + pageSize;
   const paginatedTours = tours.slice(startIndex, endIndex);

   useEffect(() => {
      if (!location.state) {
         navigate('/');
      } else {
         setActiveImage(1);
         axios
            .get(`https://tiys.herokuapp.com/api/auth`, {
               headers: {
                  'x-auth-token': location.state.token,
                  'Content-Type': 'application/json',
               },
            })
            .then((response) => {
               //    console.log(response.data);
            })
            .catch((error) => {
               console.error('Error fetching user: ', error);
            });
      }
   }, []);

   //Get Tours from DB
   useEffect(() => {
      const getData = async () => {
         try {
            const response = await axios.get(
               'https://tiys.herokuapp.com/api/tours'
            );
            // console.log(response.data);
            setTours(response.data);
         } catch (error) {
            console.log(error);
         }
      };

      getData();
   }, []);

   //Get Pois Grades from DB
   useEffect(() => {
      const getGradesData = async () => {
         try {
            const response = await axios.get(
               'https://tiys.herokuapp.com/api/grades'
            );
            // console.log(response.data);
            setPoisGrades(response.data);
         } catch (error) {
            console.log(error);
         }
      };

      getGradesData();
   }, []);

   useEffect(() => {
      if (selectedRowData && poisIds.length > 0 && poisGrades.length > 0) {
         const filteredGrades = poisGrades.filter((poi) => {
            return poisIds.includes(poi.poiid.poiid);
         });

         setFilteredData(filteredGrades);
      }
      // Chosen card data
      else if (
         selectedCardData &&
         cardPoisIds.length > 0 &&
         poisGrades.length > 0
      ) {
         const filteredCardGrades = poisGrades.filter((poi) => {
            return cardPoisIds.includes(poi.poiid.poiid);
         });
         setFilteredData(filteredCardGrades);
      }
   }, [selectedRowData, selectedCardData, poisIds, poisGrades]);

   //Display Filtered Data On Row Selection
   const onRowsSelectionHandler = (ids) => {
      if (ids.length === 0) {
         setSelectedRowData([]);
         setPoisIds([]);
         return;
      }

      const selectedRow = ids.map((id) =>
         tours.find((tour) => tour._id === id)
      );

      setSelectedRowData(selectedRow);

      const poiIds = selectedRow[0].pois.map((poi) => poi.poiid);
      setPoisIds(poiIds);
   };

   const handlePageChange = (event, value) => {
      setCurrentPage(value);
   };

   const handleCardChoice = (selectedRoute) => {
      if (selectedRoute === '') {
         return;
      }

      const tourID = selectedRoute._id;
      const selectedTour = paginatedTours.find((tour) => tour._id === tourID);
      const poiIds = selectedTour.pois.map((poi) => poi.poiid);
      setPoisIds(poiIds);
      setSelectedCardData(selectedTour);
   };

   return (
      <>
         <NavBarExternal activeImage={activeImage} userRole={user} />
         <Typography
            component='div'
            sx={
               !isSmallScreen
                  ? { mt: '10%', ml: '3%', fontSize: '1.2rem' }
                  : { textAlign: 'center', mt: '15%', fontSize: '1.12rem' }
            }
         >
            <h2>Researcher Dashboard</h2>
         </Typography>
         <Typography
            component='div'
            sx={
               !isSmallScreen
                  ? { mt: '1%', ml: '4%' }
                  : {
                       textAlign: 'center',
                       mt: '5%',
                       fontSize: '1rem',
                    }
            }
         >
            <h3>Tours Statistics</h3>
         </Typography>
         {!isSmallScreen ? (
            <Box
               sx={
                  !isSmallScreen
                     ? { width: '80%', ml: '5%' }
                     : { width: '90%', ml: '5%' }
               }
            >
               <DataGrid
                  slots={{
                     toolbar: GridToolbar,
                  }}
                  rows={tours.map((route) => ({
                     ...route,
                     id: route._id,
                     pois: route.pois.length,
                     grade: route.evaluation_grade.toFixed(2),
                  }))}
                  columns={columns}
                  onRowSelectionModelChange={(id) => onRowsSelectionHandler(id)}
                  initialState={{
                     pagination: {
                        paginationModel: {
                           pageSize: 5,
                        },
                     },
                  }}
                  pageSizeOptions={[5]}
                  checkboxSelection
                  disableRowSelectionOnClick
               />
            </Box>
         ) : (
            <div>
               {paginatedTours.map((route) => (
                  <Card
                     key={route._id}
                     style={{
                        cursor: 'pointer',
                        width: '250px',
                        border: '1px solid black',
                        boxShadow: '2px 4px 8px rgba(0, 0, 0, 0.8)',
                        marginBottom: '30px',
                        marginLeft: '57px',
                     }}
                     onClick={() => handleCardChoice(route)}
                  >
                     <CardContent>
                        <Typography>
                           <b>Tour ID: </b>
                           {route.routeid}
                        </Typography>
                        <Typography>
                           <b>Tour Name: </b>
                           {route.name}
                        </Typography>
                        <Typography>
                           <b>Tour Theme: </b>
                           {route.theme}
                        </Typography>
                        <Typography>
                           <b>AR Level: </b>
                           {route.experience_level}
                        </Typography>
                        <Typography>
                           <b>POI Amount: </b>
                           {route.pois.length}
                        </Typography>
                        <Typography>
                           <b>Evaluation Grade: </b>
                           {route.evaluation_grade.toFixed(2)}
                        </Typography>
                        <Typography>
                           <b>Tour Duration: </b>
                           {route.duration}
                        </Typography>
                        <Typography>
                           <b>Consumer / Producer: </b>
                           {route.type}
                        </Typography>
                     </CardContent>

                     <div className={styles.card}></div>
                  </Card>
               ))}
               <div className={styles.pagination}>
                  <Pagination
                     count={Math.ceil(tours.length / pageSize)}
                     page={currentPage}
                     onChange={handlePageChange}
                  />
               </div>
            </div>
         )}
         <br />
         <br />
         {/* Second DataGrid (Table) */}
         {selectedRowData && filteredData ? (
            <Box
               sx={
                  !isSmallScreen
                     ? { width: '70%', ml: '5%' }
                     : { width: '90%', ml: '5%' }
               }
            >
               <DataGrid
                  slots={{
                     toolbar: GridToolbar,
                  }}
                  rows={filteredData.map((row) => {
                     return {
                        ...row,
                        id: row._id,
                        poiid: row.poiid.poiid,
                        name: row.poiid.name,
                        grade: row.grade,
                        email: row.user.email,
                     };
                  })}
                  columns={columnsSecond}
                  initialState={{
                     pagination: {
                        paginationModel: {
                           pageSize: 5,
                        },
                     },
                  }}
                  pageSizeOptions={[5]}
                  disableRowSelectionOnClick
               />
            </Box>
         ) : (
            ''
         )}
      </>
   );
};

export default ToursTable;
