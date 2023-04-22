import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Add_Route from "./Add_Route";
import Update_Route from "./Update_Route";
import { useState } from "react";
import "./Route_Table.css";

function MyComponent(props) {
  const [routes, setRoutes] = React.useState([]);
  const [showAddForm, setAddShowForm] = useState(false);
  const [showUpdateForm, setUpdateShowForm] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [routeid, setRouteid] = useState(0);

  function handleCancelAdd() {
    setAddShowForm(false);
  }


  function handleCancelUpdate() {
    setUpdateShowForm(false);
  }

  React.useEffect(() => {
    async function fetchData() {
      const response = await axios.get("https://tiys.herokuapp.com/api/routes");
      setRoutes(response.data);
    }

    fetchData();
  }, []);

  function handleAddRoute(id) {
    setAddShowForm(true);
    setRouteid(routes.length - 1);
  }
  console.log(routeid);

  // }
  function handleUpdate(id) {
    // console.log("Selected POI ID:", id);
    const selected = routes.find((route) => route.routeid === id);
    // console.log(selected);
    setSelectedRoute(selected);
    setUpdateShowForm(true);
  }

  //   React.useEffect(() => {
  //     if (selectedPoi !== null) {
  //       console.log(selectedPoi);
  //     }
  //   }, [selectedPoi]);

  // console.log(selectedPoi);
  function handleDelete(ids) {
    // handle delete logic here
    console.log("Deleting IDs:", ids);
  }
  console.log(routes);
  // Find the route with the most POIs
  const mostPoisRoute = routes.reduce((prev, current) => {
    return prev && prev.pois.length > current.pois.length ? prev : current;
  }, null);

  //   Generate columns based on the number of POIs in the mostPoisRoute
  let poiColumns = [];
  if (mostPoisRoute && mostPoisRoute.pois && mostPoisRoute.pois.length > 0) {
    poiColumns = Array.from({ length: mostPoisRoute.pois.length }, (_, i) => ({
      field: `pois[${i}].name`,
      headerName: `POI ${i + 1}`,
      flex: 1,
      valueGetter: (params) => params.row.pois.map((poi) => poi.name)[i],
    }));
  }

  const columns = [
    { field: "description", headerName: "Description", flex: 1 },
    ...poiColumns, // Spread the poiColumns array here
    { field: "evaluation_grade", headerName: "Evaluation Grade", flex: 1 },
    { field: "experience_level", headerName: "Experience Level", flex: 1 },
    {
      field: "theme.theme",
      headerName: "Theme",
      flex: 1,
      valueGetter: (params) => params.row.theme.theme,
    },
    { field: "imgurl", headerName: "Imgurl", flex: 1 },
    {
      field: "update",
      headerName: "",
      flex: 0.5,
      renderCell: (params) => (
        <button onClick={() => handleUpdate(params.row.routeid)}>Update</button>
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
    <div>
      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={routes.map((route) => ({ ...route, id: route._id }))}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          style={{ fontSize: "14px" }}
          checkboxSelection
          onSelectionModelChange={(ids) =>
            setRoutes((prevPois) =>
              prevPois.map((poi) => ({
                ...poi,
                _selected: ids.indexOf(poi._id) !== -1,
              }))
            )
          }
        />{" "}
        <button onClick={handleAddRoute}> Add New Route </button>
        <button onClick={handleDeleteSelected}> Delete Selected </button>
      </div>
      {showAddForm && (
        <div className="lightbox">
          <div className="lightbox-content">
            <button className="close-button" onClick={handleCancelAdd}>
              X
            </button>
            <Add_Route lastRouteId={routeid} onCancel={handleCancelAdd} />{" "}
          </div>
        </div>
      )}
      {showUpdateForm && (
        <div className="lightbox">
          <div className="lightbox-content">
            <button className="close-button" onClick={handleCancelUpdate}>
              X
            </button>
            <Update_Route
              onCancel={handleCancelUpdate}
              selectedRoute={selectedRoute}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default MyComponent;
