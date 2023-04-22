import React from 'react';
import styles from './LoadingBar.module.css';

const LoadingBar = () => {
   return (
      <div className={styles.container_loader}>
         <div className={styles.cssload_loader}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
         </div>
      </div>
   );
};

export default LoadingBar;
