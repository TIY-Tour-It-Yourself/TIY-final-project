import React from 'react';
import './index.css';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LoginPage from './Pages/LoginPage';
import { Routes, Route } from 'react-router-dom';
import RegisterPage from './Pages/RegisterPage';
import DashboardPage from './Pages/DashboardPage';
import FormConsumerPage from './Pages/FormConsumerPage';
import FormProducerPage from './Pages/FormProducerPage';
import FormModifierPage from './Pages/FormModifierPage';
import NotFoundPage from './Pages/NotFoundPage';
import AccountPage from './Pages/AccountPage';
import ToursPage from './Pages/ToursPage';
import MapBuilderPage from './Pages/MapBuilderPage';
import ResearcherPage from './Pages/ResearcherPage';
import ToursTablePage from './Pages/ToursTablePage';
import EventsModalPage from './Pages/EventsModalPage';
import AdminPage from './Pages/AdminPage';
import AddPoisPage from './Pages/AddPoisPage';
import PoisTablePage from './Pages/PoisTablePage';
import UpdatePoisPage from './Pages/UpdatePoisPage';
import AddRoutePage from './Pages/AddRoutePage';
import UpdateRoutePage from './Pages/UpdateRoutePage';
import RouteTablePage from './Pages/RouteTablePage';
import UserTablePage from './Pages/UserTablePage';
import UpdateUserPage from './Pages/UpdateUserPage';
import ThemeCustomizationPage from './Pages/ThemeCustomizationPage';
import ExternalAccountPage from './Pages/ExternalAccountPage';

// Get the Google Maps API key from the environment variable
const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const googleClientAPIKey = process.env.REACT_APP_GOOGLE_CLIENT_API_KEY;

// Function to dynamically add the Google Maps API script to the HTML document
const addGoogleMapsScript = () => {
   const script = document.createElement('script');
   script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&libraries=geometry`;
   script.async = true;
   script.defer = true;
   document.head.appendChild(script);
};

// Call the function to add the Google Maps API script dynamically
addGoogleMapsScript();

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
   <GoogleOAuthProvider clientId={googleClientAPIKey}>
      <React.StrictMode>
         <BrowserRouter>
            <Routes>
               <Route path='/' element={<LoginPage />} />
               <Route path='/login' element={<LoginPage />} />
               <Route path='/register' element={<RegisterPage />} />
               <Route path='/dashboard' element={<DashboardPage />} />
               <Route path='/res_dashboard' element={<ResearcherPage />} />
               <Route path='/admin' element={<AdminPage />} />
               <Route path='/pois_table' element={<PoisTablePage />} />{' '}
               <Route path='/add_pois' element={<AddPoisPage />} />{' '}
               <Route path='/route_table' element={<RouteTablePage />} />{' '}
               <Route path='/users_table' element={<UserTablePage />} />{' '}
               <Route path='/add_route' element={<AddRoutePage />} />{' '}
               <Route path='/update_route' element={<UpdateRoutePage />} />{' '}
               <Route path='/update_poi' element={<UpdatePoisPage />} />{' '}
               <Route path='/update_user' element={<UpdateUserPage />} />{' '}
               <Route path='/tours_table' element={<ToursTablePage />} />
               <Route path='/form_consumer' element={<FormConsumerPage />} />
               <Route path='/form_modifier' element={<FormModifierPage />} />
               <Route path='/form_producer' element={<FormProducerPage />} />
               <Route path='/map_builder' element={<MapBuilderPage />} />
               <Route path='/events_choice' element={<EventsModalPage />} />
               <Route path='/user_settings' element={<AccountPage />} />
               <Route
                  path='/external_user_settings'
                  element={<ExternalAccountPage />}
               />
               <Route path='/tours_history' element={<ToursPage />} />
               <Route
                  path='/theme_customization'
                  element={<ThemeCustomizationPage />}
               />
               <Route path='*' element={<NotFoundPage />} />
            </Routes>
         </BrowserRouter>
      </React.StrictMode>
   </GoogleOAuthProvider>
);
