import React from 'react';
import Header from '../Additionals/Header/Header';
import Logo from '../Additionals/Logo/Logo';

const Register = (props) => {
   return (
      <>
         <Logo/>
         <Header title='Welcome!' secondaryTitle='Create A New Account' />
        
         {/* TBD: if user already signed in- go to Login page */}
      </>
   );
};

export default Register;
