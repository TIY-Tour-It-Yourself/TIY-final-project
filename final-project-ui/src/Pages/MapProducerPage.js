import React from 'react';
import NavBar from '../Components/Additionals/NavBar/NavBar';
import MapProducer from '../Components/MapPage/Map-Producer/MapProducer';
import MapModal from '../Components/MapModal/MapModal';

const MapProducerPage = () => {
   return (
      <>
        <MapModal/>
        <NavBar/>
        <MapProducer/>
      </>
   );
};

export default MapProducerPage;
