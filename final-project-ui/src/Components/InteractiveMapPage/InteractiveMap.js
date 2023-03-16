import React from 'react';
import NavBar from '../Additionals/NavBar/NavBar';
import BialikMap from '../MapPage/BiyalikMap';
import Map from '../MapPage/Map';
import styles from './InteractiveMap.module.css';

const InteractiveMap = () => {
    return(
        <>
        <NavBar/>
        <BialikMap/>
        </>
    );
}

export default InteractiveMap;