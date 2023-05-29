import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useLocation, useNavigate } from 'react-router-dom';
import { Typography, Box } from '@mui/material';

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
      width: 160,
      sortable: true,
      headerAlign: 'center',
      align: 'center',
   },
];

const ToursTable = () => {
   const location = useLocation();
   const navigate = useNavigate();
   // const [isSelectionEnabled, setIsSelectionEnabled] = useState(true);
   const [tours, setTours] = useState([]);
   const [routeTheme, setRouteThemes] = useState([]);
   const [selectedRowData, setSelectedRowData] = useState([]);
   const [poisGrades, setPoisGrades] = useState([]);
   const [poisIds, setPoisIds] = useState([]);
   const [filteredData, setFilteredData] = useState('');
   const theme = useTheme();
   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

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

   //Display Filtered Data On Row Selection
   const onRowsSelectionHandler = (ids) => {
      // console.log(isSelectionEnabled);
      // if (!isSelectionEnabled) {
      // If selection is disabled, return without updating the state
      //    return;
      // }

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

      // Disable further selection
      // setIsSelectionEnabled(false);
   };

   useEffect(() => {
      if (selectedRowData && poisIds.length > 0 && poisGrades.length > 0) {
         console.log(selectedRowData, poisIds, poisGrades);

         const filteredGrades = poisGrades.filter((poi) => {
            return poisIds.includes(poi.poiid.poiid);
         });

         setFilteredData(filteredGrades);
      }
   }, [selectedRowData, poisIds, poisGrades]);

   return (
      <>
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
               rows={tours.map((route) => ({
                  ...route,
                  id: route._id,
                  pois: route.pois.length,
                  grade: route.evaluation_grade.toFixed(2),
               }))}
               columns={columns}
               onRowSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
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
                     console.log(row); // Print the row object
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
