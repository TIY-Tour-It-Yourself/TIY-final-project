import React from 'react';
import { Container } from '@mui/material';
import styles from './PageContainer.module.css';

const PageContainer = ({ children }) => {
   return <Container className={styles.container}>{children}</Container>;
};

export default PageContainer;
