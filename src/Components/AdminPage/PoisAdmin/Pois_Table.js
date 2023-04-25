import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Add_Pois from "./Add_Poi";
import Update_Poi from "./Update_Poi";
import { useState, useEffect } from "react";
import "./Pois_Table.css";
import NavBar from "../../Additionals/NavBar/NavBar";
import { useNavigate, useLocation } from "react-router-dom";

function MyComponent(props) {
  const [pois, setPois] = React.useState([]);
  const [showAddForm, setAddShowForm] = useState(false);
  const [showUpdateForm, setUpdateShowForm] = useState(false);
  const [selectedPoi, setSelectedPoi] = useState(null);
  const [Poiid, setPoiid] = useState(0);
  const [activeImage, setActiveImage] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

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

  // console.log(selectedPoi);
  function handleDelete(ids) {
    // handle delete logic here
    console.log("Deleting IDs:", ids);
  }

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
    { field: "grade", headerName: "Grade", flex: 1 },
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
          <button onClick={() => handleUpdate(params.row.poiid)}>
            Update{" "}
          </button>
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

  function handleDeleteSelected() {
    const selectedIDs = pois
      .filter((poi) => poi._selected)
      .map((poi) => poi._id);
    handleDelete(selectedIDs);
  }

  return (
    <div>
      {/* <NavBar activeImage={activeImage} /> */}
      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={pois.map((poi) => ({ ...poi, id: poi._id }))}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          style={{ fontSize: "14px" }}
          checkboxSelection
          onSelectionModelChange={(ids) =>
            setPois((prevPois) =>
              prevPois.map((poi) => ({
                ...poi,
                _selected: ids.indexOf(poi._id) !== -1,
              }))
            )
          }
        />{" "}
        <button onClick={handleAddPoi}> Add New Poi </button>
        <button onClick={handleDeleteSelected}> Delete Selected </button>
      </div>
      {showAddForm && (
        <div className="lightbox">
          <div className="lightbox-content" style={{ marginTop: "250px" }}>
            <button className="close-button" onClick={handleCancelAdd}>
              X
            </button>
            <Add_Pois lastRouteId={Poiid} onCancel={handleCancelAdd} />{" "}
          </div>
        </div>
      )}
      {showUpdateForm && (
        <div className="lightbox">
          <div className="lightbox-content" style={{ marginTop: "250px" }}>
            <button className="close-button" onClick={handleCancelUpdate}>
              X
            </button>
            <Update_Poi
              onCancel={handleCancelUpdate}
              selectedPoi={selectedPoi}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default MyComponent;
