import React, { useState } from "react";
import axios from "axios";
import { SignUp } from "./SignUp.js";
import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";

export const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/login", {
        email,
        password,
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const handleSubmitFacebook = async (e) => {
    e.preventDefault();
    try {
      const responseFacebook = (response) => {
        console.log(response);
      };
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitGoogle = async (e) => {
    e.preventDefault();
    try {
      const responseGoogle = (response) => {
        console.log(response);
      };
    } catch (error) {
      console.error(error);
    }
  };

  //   const responseGoogle = (response) => {
  //     console.log(response);
  //   };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />

        <button type="submit"> Login </button>
        <button onClick={() => props.onFormSwitch("SignUp")}>
          Don't have an account? Register here
        </button>
      </form>

      <br />

      <FacebookLogin
        appId="669541094947903"
        fields="name,email,picture"
        callback={handleSubmitFacebook}
      />
      <br />
      <br />
      <GoogleLogin
        clientId="446945585212-eehrfino17anj29q0cv0kd4gdt5qqrgn.apps.googleusercontent.com"
        buttonText="LOGIN WITH GOOGLE"
        onSuccess={handleSubmitGoogle}
        onFailure={handleSubmitGoogle}
      />
    </div>
  );
};
