import React, { useState, useEffect } from 'react';
import styles from './Form_Consumer.module.css';
import dayjs from 'dayjs';
import axios from 'axios';
import { format } from 'date-fns';
import {
   Button,
   FormControl,
   Typography,
   Box,
   MenuItem,
   Select,
   InputLabel,
   TextField,
} from '@mui/material';
import { IconContext } from 'react-icons';
import NavBar from '../../Additionals/NavBar/NavBar';
import { style } from '@mui/system';
import { FiMapPin } from 'react-icons/fi';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const Form_Consumer = () => {
   const [experience, setExperience] = useState('');
   const [formTheme, setFormTheme] = useState(null);
   const [isFormValid, setIsFormValid] = useState(false);

   const theme = useTheme();
   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

   const navigate = useNavigate();

   const handleSubmit = (event) => {
      event.preventDefault();

      //If all fields are filled
      if (experience && formTheme) {
         setIsFormValid(true);
         // console.log(`${format(date, 'dd.MM.yy')}`);
         // console.log(`${format(time, 'hh:mm a')}`);
         navigate('/suggestions');
      } else {
         alert('All fields are required.');
         setIsFormValid(false);
      }
   };

   //Get Themes from DB
   useEffect(() => {
      axios
         .get('https://tiys.herokuapp.com/api/routes')
         .then((response) => {
            setFormTheme(response.data);
         })
         .catch((err) => {
            console.log(err);
         });
   }, []);

   return (
      <>
         <NavBar />
         <Typography component='div' className={styles.title}>
            <h1 style={!isSmallScreen ? {} : { fontSize: '25px' }}>
               Choose Your Tour
            </h1>
         </Typography>
         <Box
            component='div'
            className={styles.sec_titles}
            style={
               !isSmallScreen
                  ? {
                       display: 'flex',
                       flexWrap: 'wrap',
                       flexDirection: 'row',
                       justifyContent: 'center',
                       margin: '0 auto',
                       width: '80%',
                    }
                  : {
                       display: 'flex',
                       flexDirection: 'column',
                       border: '2px solid black',
                    }
            }
         >
            <Box>
               <div>
                  <span>
                     <b>Choose Tour Theme:</b>
                  </span>
               </div>
               <FormControl sx={!isSmallScreen ? { width: '200px' }:{ width: '200px' }} margin='normal'>
                  <InputLabel id='select-label'>Choose Theme...</InputLabel>
                  <Select
                     sx={{ height: 50 }}
                     labelId='demo-simple-select-label'
                     id='formTheme'
                     value={formTheme}
                     label='formTheme'
                     required
                     onChange={(e) => setFormTheme(e.target.value)}
                  >
                     <MenuItem value={'Sport'}>Sport</MenuItem>
                     <MenuItem value={'Music'}>Music</MenuItem>
                     <MenuItem value={'Culture'}>Culture</MenuItem>
                     <MenuItem value={'Food'}>Food</MenuItem>
                     <MenuItem value={'History'}>History</MenuItem>
                     <MenuItem value={'Education'}>Education</MenuItem>
                  </Select>
               </FormControl>
            </Box>
            <Box>
               <div>
                  <span>
                     <b>Choose AR Experience:</b>
                  </span>
               </div>
               <FormControl sx={{ width: '100%' }} margin='dense'>
                  <div>
                     blablabla
                  </div>
                  {/* <Select
                     sx={{ height: 50, marginBottom: 1 }}
                     labelId='demo-simple-select-label'
                     id='experience'
                     value={experience}
                     label='experience'
                     required
                     onChange={(e) => setExperience(e.target.value)}
                  >
                     <MenuItem value={'Intermediate'}>Intermediate</MenuItem>
                     <MenuItem value={'Advanced'}>Advanced</MenuItem>
                     <MenuItem value={'Professional'}>Professional</MenuItem>
                  </Select> */}
               </FormControl>
            </Box>
         </Box>
         <Box className={styles.form}>
            <FormControl
               onSubmit={handleSubmit}
               sx={isSmallScreen ? { width: '100%' } : { width: '45%' }}
            >
               {/* <label className={styles.labels} htmlFor='date-and-time'>
                  <b>Choose Date & Time:</b>
               </label>
               <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <MobileDatePicker
                     sx={{ width: '90%' }}
                     defaultValue={dayjs()}
                     value={date}
                     onChange={(newDate) => setDate(newDate)}
                     renderInput={(params) => <TextField {...params} />}
                     required
                  />
                  <MobileTimePicker
                     sx={{ width: '90%', mt: '10px' }}
                     defaultValue={dayjs()}
                     value={time}
                     onChange={(newTime) => setTime(newTime)}
                     renderInput={(params) => <TextField {...params} />}
                     required
                  />
               </LocalizationProvider> */}

               <Button
                  onClick={handleSubmit}
                  type='submit'
                  variant='contained'
                  color='primary'
                  sx={
                     isSmallScreen
                        ? { mt: 2, ml: 2, width: '80%', fontSize: 'small' }
                        : { mt: 1, ml: 14, width: '50%' }
                  }
                  style={{
                     borderRadius: 20,
                     backgroundColor: '#2471A3',
                  }}
               >
                  Get A Tour!&nbsp;&nbsp;
                  <IconContext.Provider
                     value={{ color: 'white', size: '17px' }}
                  >
                     <FiMapPin />
                  </IconContext.Provider>
               </Button>
            </FormControl>
         </Box>
      </>
   );
};

export default Form_Consumer;
