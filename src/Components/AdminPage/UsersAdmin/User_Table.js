import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Button, Pagination } from "@mui/material";
import axios from "axios";
import Add_User from "./Add_User";
import Update_User from "./Update_User";
import { useState, useEffect } from "react";
import styles from "./User_Table.module.css";
import NavBarExternal from "../../Additionals/NavBarExternal/NavBarExternal";
import { useNavigate, useLocation } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function Users_Table(props) {
  const [admin, setAdmin] = useState("");
  const [users, setUsers] = useState([]);
  const [showAddForm, setAddShowForm] = useState(false);
  const [showUpdateForm, setUpdateShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [Poiid, setPoiid] = useState(0);
  const [activeImage, setActiveImage] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const pageSize = 1;
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = users.slice(startIndex, endIndex);

  useEffect(() => {
    if (!location.state) {
      navigate("/");
    } else {
      axios
        .get(`https://tiys.herokuapp.com/api/auth`, {
          headers: {
            "x-auth-token": location.state.token,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setAdmin(location.state.userRole);
        })
        .catch((error) => {
          console.error("Error fetching user: ", error);
        });
    }
  }, [location.state]);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get("https://tiys.herokuapp.com/api/users");
      setUsers(response.data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedUser !== null) {
      console.log(selectedUser);
    }
  }, [selectedUser]);

  function handleUpdate(email) {
    const selected = users.find((user) => user.email === email);
    setSelectedUser(selected);
    setUpdateShowForm(true);
  }
  function handleAddUser(id) {
    setAddShowForm(true);
    setPoiid(users.length - 1);
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
  async function handleDelete(emails) {
    // Ask for confirmation before deleting
    const isConfirmed = window.confirm("Are you sure you want to delete?");

    if (isConfirmed) {
      try {
        for (const email of emails) {
          const response = await axios.delete(
            "https://tiys.herokuapp.com/api/users",
            {
              data: {
                email: email,
              },
            }
          );
          console.log(response);
          console.log(`Successfully deleted User with Email ${email}`);
          // Refresh the page
          window.location.reload();
        }
      } catch (error) {
        console.error("Error deleting users:", error);
      }
    } else {
      console.log("Deletion canceled");
    }
  }

  const columns = [
    { field: "fname", headerName: "Name", flex: 1 },
    {
      field: "email",
      headerName: "email",
      flex: 1,
    },
    {
      field: "age",
      headerName: "Age",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "is_accessible",
      headerName: "Is_Accessible",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "coins",
      headerName: "Coins",
      flex: 1,
      type: "number",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "avatar",
      headerName: "Avatar",
      flex: 1,
    },
    {
      field: "update",
      headerName: "",
      flex: 0.5,
      renderCell: (params) => {
        return (
          <Button
            variant="contained"
            onClick={() => handleUpdate(params.row.email)}
          >
            Update{" "}
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <NavBarExternal userRole={admin} />
      <div
        style={{
          marginTop: "30px",
        }}
      >
        {" "}
        {isSmallScreen ? (
          <div>
            <IconButton
              color="primary"
              aria-label="Go Back"
              onClick={handleGoBack}
              style={{
                position: "absolute",
                left: "10px",
                marginTop: "500px",
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            {paginatedUsers.map((user) => (
              <Card
                key={user.email}
                style={{
                  width: "300px", // Adjust the width as needed
                  border: "1px solid black",
                  boxShadow: "2px 4px 8px rgba(0, 0, 0, 0.8)",
                  margin: "0 auto", // Center the card horizontally
                }}
              >
                <CardContent>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "200px",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={user.avatar}
                      alt="Avatar"
                      style={{ maxWidth: "100%", height: "auto" }}
                    />{" "}
                  </div>{" "}
                  <Typography>
                    <b> FullName: </b> {user.fname}{" "}
                  </Typography>{" "}
                  <Typography>
                    <b> Email: </b> {user.email}{" "}
                  </Typography>{" "}
                  <Typography>
                    <b> Age: </b> {user.age}{" "}
                  </Typography>{" "}
                  <Typography>
                    <b> Accessiblity Required: </b> {user.is_accessible}{" "}
                  </Typography>{" "}
                  <Typography>
                    <b> Coins: </b> {user.coins}{" "}
                  </Typography>{" "}
                </CardContent>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    height: "100%",
                    marginBottom: "40px",
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={() => handleUpdate(user.email)}
                    style={{
                      flex: 1,
                      maxWidth: "140px",
                      marginLeft: "5px",
                      marginRight: "5px",
                    }}
                  >
                    Update{" "}
                  </Button>{" "}
                  <Button
                    variant="contained"
                    onClick={() => handleDelete(user.email)}
                    style={{
                      backgroundColor: "#d91d0f",
                      color: "white",
                      flex: 1,
                      maxWidth: "140px",
                      marginLeft: "5px",
                      marginRight: "5px",
                    }}
                  >
                    Delete User{" "}
                  </Button>{" "}
                </div>{" "}
              </Card>
            ))}{" "}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Pagination
                count={Math.ceil(users.length / pageSize)}
                page={currentPage}
                onChange={handlePageChange}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button variant="contained" onClick={handleAddUser}>
                Add New User{" "}
              </Button>{" "}
            </div>{" "}
          </div>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100px",
                position: "relative",
              }}
            >
              <IconButton
                color="primary"
                aria-label="Go Back"
                onClick={handleGoBack}
                style={{
                  position: "absolute",
                  left: "10px",
                  marginTop: "35px",
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <h1 style={{ marginTop: "50px" }}>Users Table</h1>
            </div>

            <div style={{ height: 500, width: "100%", marginTop: "10px" }}>
              <DataGrid
                slots={{
                  toolbar: GridToolbar,
                }}
                rows={users.map((user) => ({
                  ...user,
                  id: user.email,
                }))}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                style={{ fontSize: "14px" }}
                checkboxSelection
                onRowSelectionModelChange={(selectedUser) => {
                  setSelectedRowData(selectedUser);
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "10px",
                }}
              >
                <Button variant="contained" onClick={handleAddUser}>
                  Add New User{" "}
                </Button>{" "}
                <Button
                  variant="contained"
                  onClick={() => handleDelete(selectedRowData)}
                  style={{
                    backgroundColor: "#d91d0f",
                    color: "white",
                    marginLeft: "10px",
                  }}
                >
                  Delete User
                </Button>
              </div>
            </div>
          </>
        )}
        {showAddForm && (
          <div
            className={styles.lightbox}
            style={{ maxWidth: isSmallScreen ? "100%" : "auto" }}
          >
            <div
              className={styles.lightboxContent}
              style={{
                maxWidth: isSmallScreen ? "100%" : "auto",
              }}
            >
              <Button className="close-button" onClick={handleCancelAdd}>
                X
              </Button>
              <Add_User onCancel={handleCancelAdd} />
            </div>
          </div>
        )}
        {showUpdateForm && (
          <div
            className={styles.lightbox}
            style={{ maxWidth: isSmallScreen ? "100%" : "auto" }}
          >
            <div
              className={styles.lightboxContent}
              style={{
                maxWidth: isSmallScreen ? "100%" : "auto",
              }}
            >
              <Button className="close-button" onClick={handleCancelUpdate}>
                X
              </Button>
              <Update_User
                onCancel={handleCancelUpdate}
                selectedUser={selectedUser}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Users_Table;
