import * as React from "react";
import { DataGrid, GridToolbar, heIL } from "@mui/x-data-grid";
import { Button, Pagination } from "@mui/material";
import axios from "axios";
import Add_Pois from "./Add_Poi";
import Update_Poi from "./Update_Poi";
import { useState, useEffect } from "react";
import styles from "./Pois_Table.module.css";
import NavBar from "../../Additionals/NavBar/NavBar";
import { useNavigate, useLocation } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import * as XLSX from "xlsx";

function MyComponent(props) {
  const [token, setToken] = useState("");
  const [pois, setPois] = React.useState([]);
  const [showAddForm, setAddShowForm] = useState(false);
  const [showUpdateForm, setUpdateShowForm] = useState(false);
  const [selectedPoi, setSelectedPoi] = useState(null);
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
  const paginatedPois = pois.slice(startIndex, endIndex);

  function handleAddPoi(id) {
    setAddShowForm(true);
    setPoiid(pois[pois.length - 1].poiid);
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
          setToken(response.data.token);
          // console.log(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user: ", error);
        });
    }
  }, [location.state]);

  React.useEffect(() => {
    async function fetchData() {
      const response = await axios.get("https://tiys.herokuapp.com/api/pois");
      setPois(response.data);
    }
    fetchData();
  }, []);

  function handleUpdate(id) {
    const selected = pois.find((poi) => poi.poiid === id);
    setSelectedPoi(selected);
    setUpdateShowForm(true);
  }

  React.useEffect(() => {
    if (selectedPoi !== null) {
      console.log(selectedPoi);
    }
  }, [selectedPoi]);

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    {
      field: "coordinates.lat",
      headerName: "Latitude",
      flex: 1,
      valueGetter: (params) => params.row.coordinates.lat,
    },
    {
      field: "coordinates.lng",
      headerName: "Longitude",
      flex: 1,
      valueGetter: (params) => params.row.coordinates.lng,
    },
    { field: "description", headerName: "Description", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
    { field: "grade", headerName: "Grade", flex: 1, type: "number" },
    {
      field: "theme.theme",
      headerName: "Theme",
      flex: 1,
      valueGetter: (params) => params.row.theme.theme,
    },
    {
      field: "update",
      headerName: "",
      flex: 0.5,
      renderCell: (params) => {
        return (
          <Button
            variant="contained"
            onClick={() => handleUpdate(params.row.poiid)}
          >
            Update{" "}
          </Button>
        );
      },
    },
  ];
  function handleDelete(ids) {
    // Ask for confirmation before deleting
    const isConfirmed = window.confirm("Are you sure you want to delete?");

    if (isConfirmed) {
      console.log("POIs deleted");

      ids.forEach((id) => {
        axios
          .delete("https://tiys.herokuapp.com/api/pois", {
            data: {
              poiid: id,
            },
          })
          .then((response) => {
            console.log(`Successfully deleted POI with ID ${id}`);
            window.location.reload();
          })
          .catch((error) => {
            console.error(`Error deleting POI with ID ${id}:`, error);
          });
      });
    } else {
      console.log("Deletion canceled");
    }
  }

  // const handleExportData = (data) => {
  //   console.log("exported");
  //   const fileName = "pois.csv";
  //   const encoding = "utf-8";

  //   const blob = new Blob([data], { type: "text/csv", encoding, fileName });

  //   const link = document.createElement("a");
  //   link.href = window.URL.createObjectURL(blob);
  //   link.download = fileName;
  //   link.click();
  // };
  const handleExportData = () => {
    console.log("i enter");
    const encodedRows = pois.map((poi) => ({
      ...poi,
      id: poi.poiid,
      name: encodeURIComponent(poi.name), // Encode Hebrew text using encodeURIComponent
    }));

    const worksheet = XLSX.utils.json_to_sheet(encodedRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const downloadLink = document.createElement("a");
    downloadLink.href = window.URL.createObjectURL(data);
    downloadLink.download = "exported_data.xlsx";
    downloadLink.click();
  };
  return (
    <>
      <NavBar token={token} />
      <div
        style={{
          marginTop: "30px",
        }}
      >
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
            {paginatedPois.map((poi) => (
              <Card
                key={poi.poiid}
                style={{
                  width: "300px",
                  border: "1px solid black",
                  boxShadow: "2px 4px 8px rgba(0, 0, 0, 0.8)",
                  margin: "0 auto",
                }}
              >
                <CardContent>
                  <Typography>
                    <b>Name:</b>
                    {poi.name}
                  </Typography>
                  <Typography>
                    <b>Description:</b>
                    {poi.description}
                  </Typography>
                  <Typography>
                    <b>Address:</b>
                    {poi.address}
                  </Typography>
                  <Typography>
                    <b>Coordinates:</b>
                    <br />
                    <b>lat:</b>
                    {poi.coordinates.lat} <br />
                    <b>lng:</b>
                    {poi.coordinates.lng}
                  </Typography>
                  <Typography>
                    {" "}
                    <b>Arid:</b> {poi.arid.arid}{" "}
                  </Typography>
                </CardContent>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    height: "100%",
                    marginTop: "20px",
                    marginBottom: "40px",
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={() => handleUpdate(poi.poiid)}
                    style={{
                      flex: 1,
                      maxWidth: "140px",
                      marginLeft: "5px",
                      marginRight: "5px",
                    }}
                  >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleDelete(poi.poiid)}
                    style={{
                      backgroundColor: "#d91d0f",
                      color: "white",
                      flex: 1,
                      maxWidth: "140px",
                      marginLeft: "5px",
                      marginRight: "5px",
                    }}
                  >
                    Delete User
                  </Button>
                </div>
              </Card>
            ))}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Pagination
                count={Math.ceil(pois.length / pageSize)}
                page={currentPage}
                onChange={handlePageChange}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <Button variant="contained" onClick={handleAddPoi}>
                Add New Poi
              </Button>
            </div>
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
              <h1 style={{ marginTop: "50px" }}>POIs Table</h1>
            </div>
            <div style={{ height: 500, width: "100%", marginTop: "10px" }}>
              {" "}
              <DataGrid
                // localeText={heIL.components.MuiDataGrid.defaultProps.localeText}

                slots={{
                  toolbar: GridToolbar,
                }}
                rows={pois.map((poi) => ({
                  ...poi,
                  id: poi.poiid,
                }))}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                style={{ fontSize: "14px" }}
                checkboxSelection
                onRowSelectionModelChange={(selectedpoi) => {
                  setSelectedRowData(selectedpoi);
                }}
                encoding="UTF-8"
                onExportData={handleExportData}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <Button variant="contained" onClick={handleAddPoi}>
                  Add New Poi{" "}
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
                  Delete POI
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
                height: "750px",
                marginTop: "250px",
                maxWidth: isSmallScreen ? "100%" : "auto",
              }}
            >
              <Button className="close-button" onClick={handleCancelAdd}>
                X
              </Button>
              <Add_Pois lastRouteId={Poiid-1} onCancel={handleCancelAdd} />
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
                marginTop: "250px",
                maxWidth: isSmallScreen ? "100%" : "auto",
              }}
            >
              <Button className="close-button" onClick={handleCancelUpdate}>
                X
              </Button>
              <Update_Poi
                onCancel={handleCancelUpdate}
                selectedPoi={selectedPoi}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default MyComponent;
