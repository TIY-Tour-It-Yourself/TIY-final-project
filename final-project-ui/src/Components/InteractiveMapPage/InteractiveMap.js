import React from 'react';
import NavBar from '../Additionals/NavBar/NavBar';
import Map from '../MapPage/Map';
import styles from './InteractiveMap.module.css';

const InteractiveMap = () => {
    return(
        <>
        <NavBar/>
        <Map/>
        </>
    );
}

export default InteractiveMap;