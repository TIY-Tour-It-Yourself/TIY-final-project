import React, { useState, useEffect } from "react";
import NavBar from "../../Additionals/NavBar/NavBar";
import MapBuilder from "../../MapPage/Map-Consumer/MapBuilder";
import LoadingBar from "../../Additionals/LoadingBar/LoadingBar";
import MapModal from '../../MapModal/MapModal';

const InteractiveMap_Consumer = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // simulate a delay of 1 second
    const timer = setTimeout(() => setLoading(false), 1000);

    // cleanup function to cancel the timer
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <MapModal/>
      <NavBar />
      {loading ? <LoadingBar /> : <MapBuilder />}
    </>
  );
};

export default InteractiveMap_Consumer;