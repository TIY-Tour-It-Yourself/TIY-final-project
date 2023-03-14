import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Login_Facebook } from "./oauth/Login";
// import { SignUp } from "./oauth/SignUp";
import Maps2 from "./Try2/maps2";
import ProducerForm from "./Try2/ProducerForm";
// import Suggestion1 from "./Components/SuggestionsPage/suggestion1";
import Form from "./Try3/form";
import Print from "./Try3/print";
import BialikMap from "./Try2/BialikMap";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {" "}
    <Router>
      <Routes>
        <Route path="/form" element={<Form />} />{" "}
        {/* <Route path="/" element={<Login_Facebook onLogin={handleLogin} />} /> */}{" "}
        <Route path="/print" element={<Print />} />{" "}
        <Route path="/bialik" element={<BialikMap />} />{" "}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}{" "}
      </Routes>{" "}
    </Router>{" "}
    {/* <App /> */}{" "}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
