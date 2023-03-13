import React from 'react';
import LoginPage from './Pages/LoginPage';
import { Routes, Route } from 'react-router-dom';
import RegisterPage from './Pages/RegisterPage';
import DashboardPage from './Pages/DashboardPage';
import FormConsumerPage from './Pages/FormConsumerPage';

const App = () => {
   return (
      <>
         <Routes>
            <Route path='/' element={<LoginPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/dashboard' element={<DashboardPage />} />
            <Route path='/form_consumer' element={<FormConsumerPage />} />
         </Routes>
      </>
   );
};

export default App;
