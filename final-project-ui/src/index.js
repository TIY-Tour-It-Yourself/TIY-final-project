import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';
import LoginPage from './Pages/LoginPage';
import { Routes, Route } from 'react-router-dom';
import RegisterPage from './Pages/RegisterPage';
import DashboardPage from './Pages/DashboardPage';
import FormConsumerPage from './Pages/FormConsumerPage';
import TourCarousel from './Components/SuggestionsPage/TourCarousel';
import TourPage from './Components/SuggestionsPage/TourPage';
import BiyalikMap from './Components/MapPage/BiyalikMap';
import NotFound from './Components/NotFoundPage/NotFound';
import InteractiveMapPage from './Pages/InteractiveMapPage';
import MapProducerPage from './Pages/MapProducerPage';
import FormProducerPage from './Pages/FormProducerPage';
import BiyalikMapPage from "./Pages/BiyalikMapPage";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
   <GoogleOAuthProvider
      clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}.apps.googleusercontent.com`}
   >
      <React.StrictMode>
         <BrowserRouter>
            <Routes>
               <Route path='/' element={<LoginPage />} />
               <Route path='/login' element={<LoginPage />} />
               <Route path='/register' element={<RegisterPage />} />
               <Route path='/dashboard' element={<DashboardPage />} />
               <Route path='/form_consumer' element={<FormConsumerPage />} />
               <Route path='/form_producer' element={<FormProducerPage />} />
               <Route path='/map_producer' element={<MapProducerPage />} />
               <Route path='/interactive_map' element={<InteractiveMapPage />} />
               <Route path='/biyalik_map' element={<BiyalikMapPage />} />
               {/* <Route path='/bialik' element={<BialikMap />} /> */}
               {/* <Route path='/bialikmap' element={<BialikMapPage />} /> */}
               <Route path='/suggestions' element={<TourCarousel />} />
               <Route path='/tour1' element={<TourPage tourId={1} />} />
               <Route path='/tour2' element={<TourPage tourId={2} />} />
               <Route path='/tour3' element={<TourPage tourId={3} />} />
               <Route path='/tour4' element={<TourPage tourId={4} />} />
               <Route path='/tour5' element={<TourPage tourId={5} />} />
               <Route path="*" element={<NotFound />} />
            </Routes>
         </BrowserRouter>
      </React.StrictMode>
   </GoogleOAuthProvider>
);
