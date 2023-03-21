import React from 'react';
import { Container } from '@mui/material';
import styles from './PageContainer.module.css';

const PageContainer = ({ children }) => {
  return (
    <Container className={styles.container} sx={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      {children}
    </Container>
  );
};

export default PageContainer;
