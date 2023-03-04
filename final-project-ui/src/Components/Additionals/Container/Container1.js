import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import styles from './Container.module.css';
import { useState } from 'react';

const Container = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

   return (
      <Container fixed className={styles.container}>
      {/* <FormControl onSubmit={loginUser} style={{ textAlign: 'center' }}>  */}
      <FormControl>
        <TextField id={styles.textfield} color='secondary' label='Email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} required
          fullWidth margin='normal' autoComplete='email' autoFocus />
        <TextField id={styles.textfield1} color='secondary' label='Password' type='password' value={password} onChange={(e) => setPassword(e.target.value)}
          required fullWidth margin='normal'/>
        <Button type='submit' id={styles.signInButton} variant='contained' color='secondary' >
          SIGN IN
        </Button>
        <Typography id={styles.ask} display='block' variant='subtitle2' align='center' >
          Don't have an account?
        </Typography>
       <Link id={styles.regLink} href='/register' variant='body2'>
          Create Account
        </Link> 
      </FormControl>
      {/* </FormControl> */}
    </Container>
   );
};

export default Container;
