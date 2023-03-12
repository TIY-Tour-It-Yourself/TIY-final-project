import React, { useState } from "react";
import FacebookLogin from "react-facebook-login";
import { Card, Image } from "react-bootstrap";
import "../App.css";
// import { faFacebookF } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF } from "@fortawesome/free-brands-svg-icons";

export function Login_Facebook() {
  const [login, setLogin] = useState(false);
  const [data, setData] = useState({});
  const [picture, setPicture] = useState("");

  const responseFacebook = (response) => {
    console.log(response);
    setData(response);
    setPicture(response.picture.data.url);
    if (response.accessToken) {
      setLogin(true);
    } else {
      setLogin(false);
    }
  };

  return (
    <div className="container">
      <Card style={{ width: "600px" }}>
        <Card.Header>
          {" "}
          {!login && (
            <FacebookLogin
              appId="943123410051874"
              autoLoad={true}
              fields="name,email,picture"
              scope="public_profile,user_friends"
              callback={responseFacebook}
              buttonStyle={{
                backgroundColor: "#3b5998",
                border: "none",
                borderRadius: "3px",
                padding: "8px 15px",
                fontSize: "14px",
                color: "#fff",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
              }}
              textButton=""
              icon={<FontAwesomeIcon icon={faFacebookF} />}
            />
          )}
          {login && <Image src={picture} roundedCircle />}{" "}
        </Card.Header>
        {login && (
          <Card.Body>
            <Card.Title> {data.name} </Card.Title>
            <Card.Text> {data.email} </Card.Text>
          </Card.Body>
        )}
      </Card>
    </div>
  );
}

// export default Login_Facebook;
