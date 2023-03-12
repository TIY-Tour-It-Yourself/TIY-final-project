import React from 'react';
import LoginPage from './Pages/LoginPage';
import { Routes, Route } from 'react-router-dom';
import RegisterPage from './Pages/RegisterPage';
import Dashboard from './Components/DashboardPage/Dashboard';
import Form_Consumer from './Components/FormPage/Form- Consumer/Form_Consumer';

const App = () => {
   return (
      <>
         <Routes>
            <Route path='/' element={<LoginPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/dashboard' element={<Dashboard />} />
            {/* <Route path='/form_consumer' element={<Form_Consumer />} /> */}
         </Routes>
      </>
   );
};

export default App;
