import React from 'react';
import styles from './Header.module.css';

const Header = (props) => {
   return (
      <>
         <header className={styles.title}>
            <h1>{props.title}</h1>
            <h2>{props.secondaryTitle}</h2>
         </header>
      </>
   );
};

export default Header;
