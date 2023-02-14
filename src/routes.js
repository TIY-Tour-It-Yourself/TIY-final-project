import { BrowserRouter, Route, Routes } from "react-router-dom";
import { OAuthPopup } from "./oauth/OAuth2Popup.js";
import { homePage } from "./homePage/HomePage.js";
import { SignUp } from "./oauth/SignUp";
import { Login } from "./oauth/Login";

export const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<Login />} exact path="/" />
      <Route element={<SignUp />} path="/SignUp" />
    </Routes>
  </BrowserRouter>
);

// export default Example;
