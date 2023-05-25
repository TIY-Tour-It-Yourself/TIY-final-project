// import * as React from "react";
// import { DataGrid, GridToolbar } from "@mui/x-data-grid";
// import { Button, Pagination } from "@mui/material";
// import axios from "axios";
// import Add_User from "./Add_User";
// import Update_User from "./Update_User";
// import { useState, useEffect } from "react";
// import "./User_Table.css";
// import NavBar from "../../Additionals/NavBar/NavBar";
// import { useNavigate, useLocation } from "react-router-dom";
// import Card from "@material-ui/core/Card";
// import CardContent from "@material-ui/core/CardContent";
// import Typography from "@material-ui/core/Typography";
// import { useMediaQuery } from "@material-ui/core";

// function Users_Table(props) {
//   const [users, setUsers] = React.useState([]);
//   const [showAddForm, setAddShowForm] = useState(false);
//   const [showUpdateForm, setUpdateShowForm] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [Poiid, setPoiid] = useState(0);
//   const [activeImage, setActiveImage] = useState(null);
//   const [selectedRowData, setSelectedRowData] = useState([]);
//   const location = useLocation();
//   const navigate = useNavigate();

//   const isSmallScreen = useMediaQuery("(max-width: 600px)");
//   const pageSize = 1;
//   const [currentPage, setCurrentPage] = useState(1);

//   const handlePageChange = (event, value) => {
//     setCurrentPage(value);
//   };

//   const startIndex = (currentPage - 1) * pageSize;
//   const endIndex = startIndex + pageSize;
//   const paginatedUsers = users.slice(startIndex, endIndex);

//   function handleAddUser(id) {
//     setAddShowForm(true);
//     setPoiid(users.length - 1);
//   }

//   function handleCancelAdd() {
//     setAddShowForm(false);
//   }

//   // function handleUpdatePoi(id) {
//   //   // find the selected POI by id
//   //   const selected = pois.find((poi) => poi._id === id);
//   //   setSelectedPoi(selected); // set the selected POI data
//   //   setUpdateShowForm(true);
//   // }

//   function handleCancelUpdate() {
//     setUpdateShowForm(false);
//   }

//   // useEffect(() => {
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
//       const response = await axios.get("https://tiys.herokuapp.com/api/users");
//       setUsers(response.data);
//     }
//     fetchData();
//   }, []);

//   function handleUpdate(email) {
//     const selected = users.find((user) => user.email === email);
//     setSelectedUser(selected);
//     setUpdateShowForm(true);
//   }

//   useEffect(() => {
//     if (selectedUser !== null) {
//       console.log(selectedUser);
//     }
//   }, [selectedUser]);

//   function handleAdd() {
//     // handle add logic here
//   }

//   const columns = [
//     { field: "fname", headerName: "Name", flex: 1 },
//     {
//       field: "email",
//       headerName: "email",
//       flex: 1,
//     },
//     // {
//     //   field: "password",
//     //   headerName: "Password",
//     //   flex: 1,
//     // },
//     { field: "age", headerName: "Age", flex: 1 },
//     { field: "is_accessible", headerName: "Is_Accessible", flex: 1 },
//     { field: "coins", headerName: "Coins", flex: 1, type: "number" },
//     {
//       field: "avatar",
//       headerName: "Avatar",
//       flex: 1,
//     },
//     {
//       field: "update",
//       headerName: "",
//       flex: 0.5,
//       renderCell: (params) => {
//         return (
//           <Button
//             variant="contained"
//             onClick={() => handleUpdate(params.row.email)}
//           >
//             Update{" "}
//           </Button>
//         );
//       },
//     },
//   ];
//   async function handleDelete(emails) {
//     try {
//       for (const email of emails) {
//         const response = await axios.delete(
//           "https://tiys.herokuapp.com/api/users",
//           {
//             data: {
//               email: email,
//             },
//           }
//         );
//         console.log(response);
//         console.log(`Successfully deleted User with Email ${email}`);
//       }
//     } catch (error) {
//       console.error("Error deleting users:", error);
//     }
//   }

//   return (
//     <div
//       style={{
//         marginTop: "30px",
//       }}
//     >
//       {isSmallScreen ? (
//         <div>
//           {paginatedUsers.map((user) => (
//             <Card key={user.id}>
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
//                     src={user.avatar}
//                     alt="Avatar"
//                     style={{ maxWidth: "100%", height: "auto" }}
//                   />
//                 </div>
//                 <Typography>
//                   <b>FullName:</b>
//                   {user.fname}
//                 </Typography>
//                 <Typography>
//                   <b>Email:</b>
//                   {user.email}
//                 </Typography>
//                 <Typography>
//                   <b>Age:</b>
//                   {user.age}
//                 </Typography>
//                 <Typography>
//                   <b>Accessiblity Required:</b>
//                   {user.is_accessible}
//                 </Typography>
//                 <Typography>
//                   <b>Coins:</b> {user.coins}
//                 </Typography>
//                 {/* <Typography>
//                   <b>Avatar Url:</b>
//                   {user.avatar}
//                 </Typography> */}
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
//                     // marginLeft: "10px",
//                     flex: 1,
//                   }}
//                 >
//                   Delete User
//                 </Button>
//               </div>
//             </Card>
//           ))}
//           <Pagination
//             count={Math.ceil(users.length / pageSize)}
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
//             <Button variant="contained" onClick={handleAddUser}>
//               Add New User
//             </Button>
//           </div>
//         </div>
//       ) : (
//         <div style={{ height: 500, width: "100%" }}>
//           <DataGrid
//             slots={{
//               toolbar: GridToolbar,
//             }}
//             rows={users.map((user) => ({
//               ...user,
//               id: user.email,
//             }))}
//             columns={columns}
//             pageSize={5}
//             rowsPerPageOptions={[5]}
//             style={{ fontSize: "14px" }}
//             checkboxSelection
//             onRowSelectionModelChange={(selectedUser) => {
//               setSelectedRowData(selectedUser);
//             }}
//           />
//           <Button
//             variant="contained"
//             onClick={handleAddUser}
//             style={{
//               marginTop: "20px",
//             }}
//           >
//             Add New User
//           </Button>
//           <Button
//             variant="contained"
//             onClick={() => handleDelete(selectedRowData)}
//             style={{
//               backgroundColor: "#d91d0f",
//               color: "white",
//               marginTop: "20px",
//             }}
//           >
//             Delete User
//           </Button>
//         </div>
//       )}

//       {showAddForm && (
//         <div className="lightbox">
//           <div className="lightbox-content" style={{ marginTop: "250px" }}>
//             <Button className="close-button" onClick={handleCancelAdd}>
//               X
//             </Button>
//             <Add_User onCancel={handleCancelAdd} />
//           </div>
//         </div>
//       )}
//       {showUpdateForm && (
//         <div className="lightbox">
//           <div className="lightbox-content" style={{ marginTop: "250px" }}>
//             <Button className="close-button" onClick={handleCancelUpdate}>
//               X
//             </Button>
//             <Update_User
//               onCancel={handleCancelUpdate}
//               selectedUser={selectedUser}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Users_Table;
