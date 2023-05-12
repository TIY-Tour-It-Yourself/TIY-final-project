import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';
import LoginPage from './Pages/LoginPage';
import { Routes, Route } from 'react-router-dom';
import RegisterPage from './Pages/RegisterPage';
import DashboardPage from './Pages/DashboardPage';
import FormConsumerPage from './Pages/FormConsumerPage';
import NotFoundPage from './Pages/NotFoundPage';
import MapProducerPage from './Pages/MapProducerPage';
import FormProducerPage from './Pages/FormProducerPage';
import AccountPage from './Pages/AccountPage';
import ToursPage from './Pages/ToursPage';
import ARManagementPage from './Pages/ARManagementPage';
import MapBuilderPage from './Pages/MapBuilderPage';
import ResearcherPage from './Pages/ResearcherPage';
import ToursTablePage from './Pages/ToursTablePage';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
   <GoogleOAuthProvider clientId='302369383157-cc2iquq6s2e2ihq879qlfes2kbrc2f2e.apps.googleusercontent.com'>
      <React.StrictMode>
         <BrowserRouter>
            <Routes>
               <Route path='/' element={<LoginPage />} />
               <Route path='/login' element={<LoginPage />} />
               <Route path='/register' element={<RegisterPage />} />
               <Route path='/dashboard' element={<DashboardPage />} />
               <Route path='/res_dashboard' element={<ResearcherPage />} />
               <Route path='/tours_table' element={<ToursTablePage />} />
               <Route path='/form_consumer' element={<FormConsumerPage />} />
               <Route path='/form_producer' element={<FormProducerPage />} />
               <Route path='/map_producer' element={<MapProducerPage />} />
               <Route path='/map_builder' element={<MapBuilderPage />} />
               <Route path='/ar_page' element={<ARManagementPage />} />
               <Route path='/user_settings' element={<AccountPage />} />
               <Route path='/tours_history' element={<ToursPage />} />
               <Route path='*' element={<NotFoundPage />} />
            </Routes>
         </BrowserRouter>
      </React.StrictMode>
   </GoogleOAuthProvider>
);
