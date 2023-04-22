import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import LoginPage from "./Pages/LoginPage";
import { Routes, Route } from "react-router-dom";
import RegisterPage from "./Pages/RegisterPage";
import DashboardPage from "./Pages/DashboardPage";
import FormConsumerPage from "./Pages/FormConsumerPage";
import TourCarousel from "./Components/SuggestionsPage/TourCarousel";
import TourPage from "./Components/SuggestionsPage/TourPage";
import NotFound from "./Components/NotFoundPage/NotFound";
import InteractiveMapPage from "./Pages/InteractiveMapPage";
import MapProducerPage from "./Pages/MapProducerPage";
import FormProducerPage from "./Pages/FormProducerPage";
import BiyalikMapPage from "./Pages/BiyalikMapPage";
import Account from "./Components/AccountPage/Account";
import { Evaluations } from "./Components/EvaluationPage/Evaluations";
import ReviewForm from "./Components/EvaluationPage/ReviewForm";
import Admin from "./Components/AdminPage/Admin";
import Pois_Table from "./Components/AdminPage/PoisAdmin/Pois_Table";
import { Event } from "./Components/Event/Event";
import Add_Pois from "./Components/AdminPage/PoisAdmin/Add_Poi";
import Update_Poi from "./Components/AdminPage/PoisAdmin/Update_Poi";
import Route_Table from "./Components/AdminPage/RouteAdmin/Route_Table";
import Add_Route from "./Components/AdminPage/RouteAdmin/Add_Route";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider
    clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}.apps.googleusercontent.com`}
  >
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />{" "}
          <Route path="/login" element={<LoginPage />} />{" "}
          <Route path="/register" element={<RegisterPage />} />{" "}
          <Route path="/dashboard" element={<DashboardPage />} />{" "}
          <Route path="/user_settings" element={<Account />} />{" "}
          <Route path="/form_consumer" element={<FormConsumerPage />} />{" "}
          <Route path="/form_producer" element={<FormProducerPage />} />{" "}
          <Route path="/map_producer" element={<MapProducerPage />} />{" "}
          <Route path="/biyalik_map" element={<BiyalikMapPage />} />{" "}
          <Route path="/evaluations" element={<Evaluations />} />{" "}
          <Route path="/review_form" element={<ReviewForm />} />{" "}
          <Route path="/admin" element={<Admin />} />{" "}
          <Route path="/pois_table" element={<Pois_Table />} />{" "}
          <Route path="/add_pois" element={<Add_Pois />} />{" "}
          <Route path="/update_poi" element={<Update_Poi />} />{" "}
          <Route path="/route_table" element={<Route_Table />} />{" "}
          <Route path="/add_route" element={<Add_Route />} />{" "}
          <Route path="/events" element={<Event />} />{" "}
          <Route path="*" element={<NotFound />} />{" "}
        </Routes>{" "}
      </BrowserRouter>{" "}
    </React.StrictMode>{" "}
  </GoogleOAuthProvider>
);
