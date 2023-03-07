import React from 'react';
import LoginPage from './Pages/LoginPage';
// import Login from './Components/LoginPage/Login';
import { Routes, Route } from 'react-router-dom';
import RegisterPage from './Pages/RegisterPage';
import Dashboard from './Components/DashboardPage/Dashboard';

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<LoginPage/>} />
        <Route path='/register' element={<RegisterPage/>} />
        <Route path='/dashboard' element={<Dashboard/>} />
      </Routes>
    </>
  );
}

export default App;
