import React from 'react';
import LoginPage from './Pages/LoginPage';
// import Login from './Components/LoginPage/Login';
import { Routes, Route } from 'react-router-dom';
import RegisterPage from './Pages/RegisterPage';

const App = () => {
  return (
    // <div className="App">
    //   {/* <Register/> */}
    //   <Login/>
    // </div>
    <>
      <Routes>
        <Route path='/' element={<LoginPage/>} />
        <Route path='/register' element={<RegisterPage/>} />
      </Routes>
    </>
  );
}

export default App;
