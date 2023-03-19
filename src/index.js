import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Login_Facebook } from "./oauth/Login";
// import { SignUp } from "./oauth/SignUp";
// import Maps2 from "./Try2/ProducerMap";
import ProducerForm from "./Try2/ProducerForm";
// import Suggestion1 from "./Components/SuggestionsPage/suggestion1";
import Form from "./Try2/form";
import Print from "./Try2/print";
import BialikMap from "./Try2/BialikMap";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { Event } from "./Components//Events/Event";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
