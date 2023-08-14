import React from 'react';
import styles from './Divider.module.css';
import Typography from '@mui/material/Typography';

const Divider = (props) => {
    return(
        <div className={styles.divider}>
            <span className={styles.divider_span}><hr className={styles.divider_hr}/></span>
            <Typography display='inline' sx={{ ml:5, mr: 5}}><b>{props.title}</b></Typography>
            <span className={styles.divider_span}><hr className={styles.divider_hr}/></span>
        </div>
    );
}

export default Divider;