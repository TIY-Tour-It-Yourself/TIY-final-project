import React from 'react';
import styles from './Logo.module.css';

const Logo = (props) => {
    return(
        <div className={styles.logo}>{props.title}</div>
    );
}

export default Logo;