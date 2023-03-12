import React, { useState, useEffect } from 'react';
import {
   TextField,
   Button,
   FormControl,
   Typography,
   Link,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import FacebookLogin from "react-facebook-login";
import { googleLogout, useGoogleLogin, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import useMediaQuery from '@mui/material/useMediaQuery';
import Logo from '../Additionals/Logo/Logo';
import Header from '../Additionals/Header/Header';
import styles from './Login.module.css';
import PageContainer from '../Additionals/Container/PageContainer';
import Divider from '../Additionals/Divider/Divider';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF } from "@fortawesome/free-brands-svg-icons";

const Login = (props) => {
   const [user, setUser] = useState([]);
   const [profile, setProfile] = useState(false);
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [isValid, setIsValid] = useState(false);
   const [isDirty, setIsDirty] = useState(false); 
   const [isFormValid, setIsFormValid] = useState(false);

  const [logged, setIsLogged] = useState(false);
  const [data, setData] = useState({});
  const [picture, setPicture] = useState("");

   const navigate = useNavigate();
   
      const handleSubmit = (e) => {
         e.preventDefault();
         console.log(`Email: ${email}, Password: ${password}`);
        
         if(email.trim().length !== 0 && password.trim().length !== 0){
            setIsFormValid(true);
            navigate('/dashboard');
         }
         else
            alert("All fields are required.");
            setIsFormValid(false);
      };

   //Post request - need to post data to DB to check if specific user is already registered
   useEffect(() => {
      if(email.trim().length !== 0 && password.trim().length !== 0) {
         axios
            .post(`https://jsonplaceholder.typicode.com/users`, {email, password})
            // .get("https://jsonplaceholder.typicode.com/users/1")
            .then((response) => {
               setData(response.data);
               console.log(response.data.token);
            })
            .catch((err) => console.log(err));
      } 
   },[email, password]);
 

   //Facebook login
   const responseFacebook = (response) => {
    console.log(response);
    setData(response);
    setPicture(response.picture.data.url);
    if (response.accessToken) {
      setIsLogged(true);
    } else {
      setIsLogged(false);
    }
  };

  const fLogout = () => {
   setIsLogged(false);
   setData({});
   setPicture("");
 };

  //Google Login
   const login = useGoogleLogin({
      onSuccess: (codeResponse) => setUser(codeResponse),
      onError: (error) => console.log('Login Failed:', error)
  });

   const theme = useTheme();
   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

   useEffect(
      () => {
          if (user) {
              axios
                  .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                      headers: {
                          Authorization: `Bearer ${user.access_token}`,
                          Accept: 'application/json'
                      }
                  })
                  .then((res) => {
                     setProfile(res.data);
                     navigate('/dashboard');
                  })
                  .catch((err) => console.log(err));
          }
      },
      [ user ]
  );

  //Post request - need to post Google connection data of user to DB to check if specific user is already registered
  useEffect(() => {
   if(profile) {
      axios
         .post(`https://jsonplaceholder.typicode.com/users`, {profile})
         // .get("https://jsonplaceholder.typicode.com/users/1")
         .then((response) => {
            console.log(response.data.token);
         })
         .catch((err) => console.log(err));
   } 
   },[profile]);

  // log out function to log the user out of google and set the profile array to null
  const gLogout = () => {
      googleLogout();
      setProfile(null);
   };

   return (
      <>
         <PageContainer>
            <Logo />
            <Header title='Welcome Back!' />
            <form onSubmit={handleSubmit}>
               <FormControl
                  sx={isSmallScreen ? { width: '100%' } : { width: '45%' }}
               >
                  <TextField
                     className={styles.input}
                     label='Email'
                     type='email'
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     margin='dense'
                     error={!isValid && isDirty}
                     onBlur={() => setIsDirty(true)}
                     variant='outlined'
                     required
                  />
                  <TextField
                     className={styles.input}
                     label='Password'
                     type='password'
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     margin='dense'
                     error={!isValid && isDirty}
                     onBlur={() => setIsDirty(true)}
                     variant='outlined'
                     required
                  />
                  <Button onClick={handleSubmit}
                     className={styles.button}
                     type='submit'
                     variant='contained'
                     color='primary'
                     sx={
                        isSmallScreen
                           ? { mt: 2, ml: 2, mb: 3, width: '80%' }
                           : { mt: 3, ml: 12, mb: 3, width: '50%' }
                     }
                     style={{
                        borderRadius: 20,
                        backgroundColor: '#2471A3',
                     }}
                  >
                     Login
                  </Button>
               </FormControl>
            </form>
            <Typography sx={{ mt: 0, mb: 1, mr: 1 }}>
               <Link style={{ fontSize: '0.75rem', color: 'black'}}
                  // Need to define navigation to retreive password
                  href='/'
                  sx={{
                     textDecoration: 'none',
                     '&:hover': {
                        textDecoration: 'underline',
                     }, 
                  }}
               >
                  <b>Forgot Password?</b>
               </Link> 
               </Typography>
            <Typography style={{ fontSize: 'small' }} sx={isSmallScreen ? { mb:1 } : { mt: 2, mb: 4 }}>
               <b>Don't Have An Account?</b>{' '}
               <Link
                  href='/register'
                  sx={{
                     textDecoration: 'none',
                     '&:hover': {
                        textDecoration: 'underline',
                     },
                  }}
               >
                  Sign Up
               </Link>
            </Typography>
            <Divider title='Sign In With'/>
            <div className={styles.flexbox}>
               {/* <a href='#'>
                  <div className={styles.facebook_icon}></div>
               </a> */}
               <div className="container">
      {!logged && (
        <FacebookLogin
          appId={process.env.REACT_APP_FACEBOOK_CLIENT_ID}
          autoLoad={false}
         //  fields="name,email,picture"
         //  scope="public_profile,email,user_friends"
          callback={responseFacebook}
          buttonStyle={{
            backgroundColor: "#3b5998",
            border: "none",
            borderRadius: "3px",
            marginRight: '30px',
            marginTop: '0',
            fontSize: "35px",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "38px",
            height: "45px"
          }}
            textButton=""
            icon={<FontAwesomeIcon icon={faFacebookF} />}
         />
      )}

      {logged && (
        <div className="card">
          <div className="card-body">
            <img className="rounded" src={picture} alt="Profile" />
            <h5 className="card-title">{data.name}</h5>
            <p className="card-text">Email ID: {data.email}</p>
            <a href="#" className="btn btn-danger btn-sm" onClick={fLogout}>
              Logout
            </a>
          </div>
        </div>
      )}
    </div>
            <div>
            {profile ? (
               {/* <button onClick={logOut}>Log out</button> */}
               //  <div>
               //      <img src={profile.picture} alt="user image" />
               //      <h3>User Logged in</h3>
               //      <p>Name: {profile.name}</p>
               //      <p>Email Address: {profile.email}</p>
               //      <br />
               //      <br />
               //      <button onClick={logOut}>Log out</button>
               //  </div> */}
               
            ) : (
                <div className={styles.google_icon} onClick={() => login()}></div>
            )}
        </div>
            </div>
         </PageContainer>
      </>
   );
};

export default Login;
