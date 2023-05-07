import React from "react";
import NavBar from "../Components/Additionals/NavBar/NavBar";
import MapProducer from "../../src/Components/MapPage/Map-Producer/Map_Producer";
import MapModal from "../Components/MapModal/MapModal";

const MapProducerPage = () => {
  return (
    <>
      <MapModal />
      <NavBar />
      <MapProducer />
    </>
  );
};

export default MapProducerPage;
