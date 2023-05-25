// import * as React from "react";
// import { DataGrid, GridToolbar } from "@mui/x-data-grid";
// import axios from "axios";
// import Add_Route from "./Add_Route";
// import Update_Route from "./Update_Route";
// import { useState } from "react";
// import "./Route_Table.css";
// import NavBar from "../../Additionals/NavBar/NavBar";
// import { useNavigate, useLocation } from "react-router-dom";
// import { Button, Pagination } from "@mui/material";
// import Card from "@material-ui/core/Card";
// import CardContent from "@material-ui/core/CardContent";
// import Typography from "@material-ui/core/Typography";
// import { useMediaQuery } from "@material-ui/core";

// function MyComponent(props) {
//   const [routes, setRoutes] = React.useState([]);
//   const [showAddForm, setAddShowForm] = useState(false);
//   const [showUpdateForm, setUpdateShowForm] = useState(false);
//   const [selectedRoute, setSelectedRoute] = useState(null);
//   const [routeid, setRouteid] = useState(0);
//   const [lastRouteid, setLastRouteid] = useState(0);
//   const [activeImage, setActiveImage] = useState(null);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [selectedRowData, setSelectedRowData] = useState([]);

//   const isSmallScreen = useMediaQuery("(max-width: 600px)");
//   const pageSize = 1;
//   const [currentPage, setCurrentPage] = useState(1);

//   const handlePageChange = (event, value) => {
//     setCurrentPage(value);
//   };

//   const startIndex = (currentPage - 1) * pageSize;
//   const endIndex = startIndex + pageSize;
//   const paginatedRoutes = routes.slice(startIndex, endIndex);

//   function handleCancelAdd() {
//     setAddShowForm(false);
//   }

//   function handleCancelUpdate() {
//     setUpdateShowForm(false);
//   }

//   //  useEffect(() => {
//   //   console.log(location);
//   //   if (!location.state) {
//   //     navigate("/");
//   //   } else {
//   //     setActiveImage(1);
//   //     axios
//   //       .get(`https://tiys.herokuapp.com/api/auth`, {
//   //         headers: {
//   //           "x-auth-token": location.state.token,
//   //           "Content-Type": "application/json",
//   //         },
//   //       })
//   //       .then((response) => {
//   //         // console.log(response.data);   //user's data
//   //       })
//   //       .catch((error) => {
//   //         console.error("Error fetching user: ", error);
//   //       });
//   //   }
//   // }, [location.state]);

//   React.useEffect(() => {
//     async function fetchData() {
//       const response = await axios.get("https://tiys.herokuapp.com/api/routes");
//       setRoutes(response.data);
//     }

//     fetchData();
//   }, []);

//   var routeLength = routes.length - 1;

//   function handleAddRoute(id) {
//     setAddShowForm(true);
//     if (routes.length > 0) {
//       setLastRouteid(routes[routeLength].routeid);
//     }
//   }

//   // }
//   function handleUpdate(routeid) {
//     console.log("Selected POI ID:", routeid);
//     const selected = routes.find((route) => route.routeid === routeid);
//     setSelectedRoute(selected);
//     setUpdateShowForm(true);
//   }

//   React.useEffect(() => {
//     if (selectedRoute !== null) {
//       console.log(selectedRoute);
//     }
//   }, [selectedRoute]);

//   async function handleDelete(ids) {
//     try {
//       for (const id of ids) {
//         const response = await axios.delete(
//           "https://tiys.herokuapp.com/api/routes",
//           {
//             data: {
//               routeid: id,
//             },
//           }
//         );
//         console.log(`Successfully deleted route with ID ${id}`);
//       }
//     } catch (error) {
//       console.error("Error deleting routes:", error);
//     }
//   }

//   // Find the route with the most POIs
//   const mostPoisRoute = routes.reduce((prev, current) => {
//     return prev && prev.pois.length > current.pois.length ? prev : current;
//   }, null);

//   //   Generate columns based on the number of POIs in the mostPoisRoute
//   let poiColumns = [];
//   if (mostPoisRoute && mostPoisRoute.pois && mostPoisRoute.pois.length > 0) {
//     poiColumns = Array.from({ length: mostPoisRoute.pois.length }, (_, i) => ({
//       field: `pois[${i}].name`,
//       headerName: `POI ${i + 1}`,
//       flex: 1,
//       valueGetter: (params) => params.row.pois.map((poi) => poi.name)[i],
//     }));
//   }

//   const columns = [
//     { field: "description", headerName: "Description", flex: 1 },
//     ...poiColumns, // Spread the poiColumns array here
//     {
//       field: "evaluation_grade",
//       headerName: "Evaluation Grade",
//       flex: 1,
//       type: "number",
//     },
//     { field: "experience_level", headerName: "Experience Level", flex: 1 },
//     {
//       field: "theme.theme",
//       headerName: "Theme",
//       flex: 1,
//       valueGetter: (params) => params.row.theme.theme,
//     },
//     { field: "imgurl", headerName: "Imgurl", flex: 1 },
//     {
//       field: "update",
//       headerName: "",
//       flex: 0.5,
//       renderCell: (params) => (
//         <Button
//           variant="contained"
//           onClick={() => handleUpdate(params.row.routeid)}
//         >
//           Update{" "}
//         </Button>
//       ),
//     },
//   ];

//   function handleDeleteSelected() {
//     const selectedIDs = routes
//       .filter((route) => route._selected)
//       .map((route) => route._id);
//     handleDelete(selectedIDs);
//   }
//   // console.log(routes.theme.theme);
//   return (
//     <div
//       style={{
//         marginTop: "30px",
//       }}
//     >
//       {isSmallScreen ? (
//         <div>
//           {paginatedRoutes.map((route) => (
//             <Card key={routes.id}>
//               <CardContent>
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     height: "200px",
//                     overflow: "hidden",
//                   }}
//                 >
//                   <img
//                     src={route.imgurl}
//                     alt="Avatar"
//                     style={{ maxWidth: "100%", height: "auto" }}
//                   />
//                 </div>
//                 <Typography>
//                   <b>Description:</b>
//                   {route.description}
//                 </Typography>
//                 <Typography>
//                   <b>Pois:</b>
//                   {routes.pois}
//                 </Typography>
//                 <Typography>
//                   <b>Evaluation Grade:</b>
//                   {route.evaluation_grade}
//                 </Typography>
//                 <Typography>
//                   <b>Experience Level:</b> {route.experience_level}
//                 </Typography>
//                 <Typography>
//                   <b>Theme:</b> {route.theme.theme}
//                 </Typography>
//               </CardContent>

//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "center",
//                   height: "100%",
//                   marginTop: "20px",
//                   marginBottom: "40px",
//                 }}
//               >
//                 <Button
//                   variant="contained"
//                   onClick={handleUpdate}
//                   style={{ flex: 1 }}
//                 >
//                   Update
//                 </Button>
//                 <Button
//                   variant="contained"
//                   onClick={() => handleDelete(selectedRowData)}
//                   style={{
//                     backgroundColor: "#d91d0f",
//                     color: "white",
//                     flex: 1,
//                   }}
//                 >
//                   Delete
//                 </Button>
//               </div>
//             </Card>
//           ))}
//           <Pagination
//             count={Math.ceil(routes.length / pageSize)}
//             page={currentPage}
//             onChange={handlePageChange}
//           />
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               marginTop: "20px",
//             }}
//           >
//             <Button variant="contained" onClick={handleAddRoute}>
//               Add New Route
//             </Button>
//           </div>
//         </div>
//       ) : (
//         <div style={{ height: 500, width: "100%" }}>
//           <DataGrid
//             slots={{
//               toolbar: GridToolbar,
//             }}
//             rows={routes.map((route) => ({
//               ...route,
//               id: route.routeid,
//               grade: route.evaluation_grade.toFixed(2),
//             }))}
//             columns={columns}
//             pageSize={5}
//             rowsPerPageOptions={[5]}
//             style={{ fontSize: "14px" }}
//             checkboxSelection
//             onRowSelectionModelChange={(selectedpoi) => {
//               setSelectedRowData(selectedpoi);
//             }}
//           />
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               marginTop: "20px",
//             }}
//           >
//             <Button variant="contained" onClick={handleAddRoute}>
//               Add New Route
//             </Button>
//             <Button
//               variant="contained"
//               onClick={() => handleDelete(selectedRowData)}
//               style={{
//                 backgroundColor: "#d91d0f",
//                 color: "white",
//                 marginLeft: "10px",
//               }}
//             >
//               Delete Route
//             </Button>
//           </div>
//         </div>
//       )}
//       {showAddForm && (
//         <div className="lightbox" style={{ width: "100%" }}>
//           <div
//             className="lightbox-content"
//             style={{ marginTop: "250px", width: "100%" }}
//           >
//             <Button
//               variant="contained"
//               className="close-button"
//               onClick={handleCancelAdd}
//             >
//               X
//             </Button>
//             <Add_Route lastRouteId={lastRouteid} onCancel={handleCancelAdd} />
//           </div>
//         </div>
//       )}
//       {showUpdateForm && (
//         <div className="lightbox" style={{ maxWidth: "100%" }}>
//           <div
//             className="lightbox-content"
//             style={{ marginTop: "250px", width: "100%" }}
//           >
//             <Button className="close-button" onClick={handleCancelUpdate}>
//               X
//             </Button>
//             <Update_Route
//               onCancel={handleCancelUpdate}
//               selectedRoute={selectedRoute}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default MyComponent;
