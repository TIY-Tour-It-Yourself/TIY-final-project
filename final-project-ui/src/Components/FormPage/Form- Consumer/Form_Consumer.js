import React, { useState, useEffect } from 'react';
import styles from './Form_Consumer.module.css';
import dayjs from 'dayjs';
import axios from 'axios';
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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const Form_Consumer = () => {
   const [date, setDate] = useState(null);
   const [time, setTime] = useState(null);
   const [experience, setExperience] = useState('');
   const [formTheme, setFormTheme] = useState('');
   const [isFormValid, setIsFormValid] = useState(false);

   const theme = useTheme();
   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

   const navigate = useNavigate();

   const handleDateChange = (date) => {
    setDate(date);
  };
   const handleSubmit = (event) => {
      event.preventDefault();
      
      //If all fields are filled
      if (date && time && experience && formTheme) {
         setIsFormValid(true);
         navigate('/map');
      } else {
        alert('All fields are required.');
        setIsFormValid(false);
      }

   };

   //Get Themes from DB
   useEffect(() => {
      axios
         .get('https://jsonplaceholder.typicode.com/users')
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
         <Box className={styles.form}>
            <FormControl
               onSubmit={handleSubmit}
               sx={isSmallScreen ? { width: '100%' } : { width: '45%' }}
            >
               <label className={styles.labels} htmlFor='date-and-time'>
                  <b>Choose Date & Time:</b>
               </label>
               <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileDatePicker sx={{width:'90%'}}
                     defaultValue={dayjs()}
                     value={date}
                     onChange={(newDate) => setDate(newDate)}
                     renderInput={(props) => <TextField {...props}/>}
                     required
                  />
                  <MobileTimePicker sx={{width:'90%', mt: '10px'}}
                     defaultValue={dayjs()}
                     value={time}
                     onChange={(newTime) => setTime(newTime)}
                     renderInput={(props) => <TextField {...props}/>}
                     required
                  />
               </LocalizationProvider>
               <br />
               <label className={styles.labels} htmlFor='date-and-time'>
                  <b>Choose AR Experience:</b>
               </label>
               <FormControl sx={{width:'90%'}} margin='dense'>
                  <InputLabel id='select-label'>
                     Choose AR Experience
                  </InputLabel>
                  <Select
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
                  </Select>
               </FormControl>
               <label className={styles.labels} htmlFor='date-and-time'>
                  <b>Choose Tour Theme:</b>
               </label>
               <FormControl sx={{width:'90%'}} margin='normal'>
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
