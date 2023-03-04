import React, { useState } from 'react';
import { TextField, Button, FormControl, Typography, Link } from '@mui/material';
import Logo from '../Additionals/Logo/Logo';
import Header from '../Additionals/Header/Header';
import styles from './Login.module.css';
import PageContainer from '../Additionals/Container/PageContainer';
import Divider from '../Additionals/Divider/Divider';

const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Email: ${email}, Password: ${password}`);
  }

  return (
    <>
    <PageContainer> 
    <Logo/>
    <Header title="Welcome Back!"/>
    <form onSubmit={handleSubmit}>
      <FormControl sx={{ width: '40%'}}>
      <TextField className={styles.input}
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
        variant="outlined"
        required
      />
      <TextField className={styles.input}
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
        variant="outlined"
        required
      />
      <Button
        className={styles.button}
        type="submit"
        variant="contained"
        color="primary"
        sx={{mt:3, ml:14, width: '50%'}}
        style={{
          borderRadius: 20,
          backgroundColor: '#2471A3'
        }}
      >
        Login
      </Button>
      </FormControl>
    </form>
    <Typography style={{fontSize: "small"}} sx={{mt:2, mb:4}}><b>Don't Have An Account?</b> <Link>Sign Up</Link></Typography>
    <Divider title="Sign In With"/>
    <div className={styles.flexbox}>
      <a href='#'>
        <div className={styles.facebook_icon}></div>
      </a>
      <a href='#'>
        <div className={styles.google_icon}></div>
      </a>
    </div>
    </PageContainer>
    </>
  );
};

export default Login;
