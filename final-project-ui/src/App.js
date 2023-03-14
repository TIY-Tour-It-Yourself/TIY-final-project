import React from 'react';
import LoginPage from './Pages/LoginPage';
import { Routes, Route } from 'react-router-dom';
import RegisterPage from './Pages/RegisterPage';
import DashboardPage from './Pages/DashboardPage';
import FormConsumerPage from './Pages/FormConsumerPage';
import InteractiveMapPage from './Pages/InteractiveMapPage';
import TourCarousel from './Components/SuggestionsPage/TourCarousel';
import TourPage from './Components/SuggestionsPage/TourPage';

const App = () => {
   return (
      <>
         <Routes>
            <Route path='/' element={<LoginPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/dashboard' element={<DashboardPage />} />
            <Route path='/form_consumer' element={<FormConsumerPage />} />
            <Route path='/interactive_map' element={<InteractiveMapPage />} />
            <Route path='/suggestions' element={<TourCarousel />} /> 
            <Route path="/tour1" element={<TourPage tourId={1} />} />
            <Route path="/tour2" element={<TourPage tourId={2} />} />
            <Route path="/tour3" element={<TourPage tourId={3} />} />
            <Route path="/tour4" element={<TourPage tourId={4} />} />
            <Route path="/tour5" element={<TourPage tourId={5} />} />
         </Routes>
      </>
   );
};

export default App;
