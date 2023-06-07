import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useLocation, useNavigate } from 'react-router-dom';
import ToursTable from './ToursTablePage/ToursTable';

const Researcher = () => {
   const location = useLocation();
   const navigate = useNavigate();
   const theme = useTheme();
   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
   const [researcher, setResearcher] = useState('');

   useEffect(() => {
      if (!location.state) {
         navigate('/');
      } else {
         const fetchUser = async () => {
            try {
               const response = await axios.get(
                  `https://tiys.herokuapp.com/api/auth`,
                  {
                     headers: {
                        'x-auth-token': location.state.token,
                        'Content-Type': 'application/json',
                     },
                  }
               );
               setResearcher('researcher');
            } catch (error) {
               console.error('Error fetching user: ', error);
            }
         };
         fetchUser();
      }
   }, []);

   return <>{researcher && <ToursTable userRole={researcher} />}</>;
};

export default Researcher;
