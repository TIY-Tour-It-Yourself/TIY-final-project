import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Button, Pagination } from "@mui/material";
import axios from "axios";
import Add_Pois from "./Add_Poi";
import Update_Poi from "./Update_Poi";
import { useState, useEffect } from "react";
import "./Pois_Table.css";
import NavBar from "../../Additionals/NavBar/NavBar";
import { useNavigate, useLocation } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { useMediaQuery } from "@material-ui/core";

function MyComponent(props) {
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
    setPoiid(pois.length - 1);
  }

  function handleCancelAdd() {
    setAddShowForm(false);
  }

  // function handleUpdatePoi(id) {
  //   // find the selected POI by id
  //   const selected = pois.find((poi) => poi._id === id);
  //   setSelectedPoi(selected); // set the selected POI data
  //   setUpdateShowForm(true);
  // }

  function handleCancelUpdate() {
    setUpdateShowForm(false);
  }

  // useEffect(() => {
  //   console.log(location);
  //   if (!location.state) {
  //     navigate("/");
  //   } else {
  //     setActiveImage(1);
  //     axios
  //       .get(`https://tiys.herokuapp.com/api/auth`, {
  //         headers: {
  //           "x-auth-token": location.state.token,
  //           "Content-Type": "application/json",
  //         },
  //       })
  //       .then((response) => {
  //         // console.log(response.data);   //user's data
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching user: ", error);
  //       });
  //   }
  // }, [location.state]);

  React.useEffect(() => {
    async function fetchData() {
      const response = await axios.get("https://tiys.herokuapp.com/api/pois");
      setPois(response.data);
    }
    fetchData();
  }, []);

  // function handleUpdate(id) {
  //   // find the selected POI by id
  //   const selected = pois.find((poi) => poi._id === id);
  //   setSelectedPoi(selected); // set the selected POI data
  //   console.log(selectedPoi);
  //   setUpdateShowForm(true); // open the form
  // }
  function handleUpdate(id) {
    // console.log("Selected POI ID:", id);
    const selected = pois.find((poi) => poi.poiid === id);
    // console.log(selected);
    setSelectedPoi(selected);
    setUpdateShowForm(true);
  }

  React.useEffect(() => {
    if (selectedPoi !== null) {
      console.log(selectedPoi);
    }
  }, [selectedPoi]);

  function handleAdd() {
    // handle add logic here
  }

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
    // {
    //     field: "delete",
    //     headerName: "",
    //     flex: 0.5,
    //     renderCell: (params) => (
    //       <input
    //         type="checkbox"
    //         value={params.row._id}
    //         onChange={(event) => handleDelete([params.row._id])}
    //       />
    //     ),
    //   },
  ];

  function handleDelete(ids) {
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
        })
        .catch((error) => {
          console.error(`Error deleting POI with ID ${id}:`, error);
        });
    });
  }

  function handleDeleteSelected() {
    const selectedIDs = pois
      .filter((poi) => poi._selected)
      .map((poi) => poi._id);
    handleDelete(selectedIDs);
  }
  console.log(selectedRowData);
  return (
    <div
      style={{
        marginTop: "30px",
      }}
    >
      {isSmallScreen ? (
        <div>
          {paginatedPois.map((poi) => (
            <Card key={poi.id}>
              <CardContent>
                {/* <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "200px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={poi.avatar}
                    alt="Avatar"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                </div> */}
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
                {/* <Typography>
                <b>Avatar Url:</b>
                {user.avatar}
              </Typography> */}
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
                  onClick={handleUpdate}
                  style={{ flex: 1 }}
                >
                  Update
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleDelete(selectedRowData)}
                  style={{
                    backgroundColor: "#d91d0f",
                    color: "white",
                    // marginLeft: "10px",
                    flex: 1,
                  }}
                >
                  Delete User
                </Button>
              </div>
            </Card>
          ))}
          <Pagination
            count={Math.ceil(pois.length / pageSize)}
            page={currentPage}
            onChange={handlePageChange}
          />
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
        <div style={{ height: 500, width: "100%" }}>
          <DataGrid
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
          />
          <Button
            variant="contained"
            onClick={handleAddPoi}
            style={{
              marginLeft: "500px",
              marginTop: "20px",
            }}
          >
            Add New Poi{" "}
          </Button>{" "}
          <Button
            variant="contained"
            onClick={() => handleDelete(selectedRowData)}
            style={{
              backgroundColor: "#d91d0f",
              color: "white",
              marginTop: "20px",
            }}
          >
            Delete POI{" "}
          </Button>{" "}
        </div>
      )}
      {showAddForm && (
        <div className="lightbox">
          <div className="lightbox-content" style={{ marginTop: "250px" }}>
            <Button className="close-button" onClick={handleCancelAdd}>
              X{" "}
            </Button>{" "}
            <Add_Pois lastRouteId={Poiid} onCancel={handleCancelAdd} />{" "}
          </div>{" "}
        </div>
      )}{" "}
      {showUpdateForm && (
        <div className="lightbox">
          <div className="lightbox-content" style={{ marginTop: "250px" }}>
            <Button className="close-button" onClick={handleCancelUpdate}>
              X{" "}
            </Button>{" "}
            <Update_Poi
              onCancle={handleCancelUpdate}
              selectedPoi={selectedPoi}
            />{" "}
          </div>{" "}
        </div>
      )}{" "}
    </div>
  );
}

export default MyComponent;
