import React from 'react';
import styles from './Grid.module.css';

const Grid = (props) => {
    const cells = props.objArray.map((obj, index) => <div key={index+1}>{obj}</div>);

    return(
    <div className={styles.grid_container}>
      {cells}
    </div>
    );
}

export default Grid;