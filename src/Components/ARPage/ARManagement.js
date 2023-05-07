import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ARManagement = () => {
  const location = useLocation();
  let latCoor, lngCoor, description, img;

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    latCoor = searchParams.get("lat");
    lngCoor = searchParams.get("lng");
    description = searchParams.get("desc");
    img = searchParams.get("img");
    console.log(
      `lat: ${latCoor}, lng: ${lngCoor}, desc: ${description}, img: ${img}`
    );
  }, [location.search]);

  const handleClick = () => {
    alert({ description });
  };

  return (
    <a-scene
      vr-mode-ui="enabled: false"
      cursor="rayOrigin: mouse"
      raycaster="near: 0; far: 50000"
      arjs="sourceType: webcam; videoTexture: true; debugUIEnabled: false;"
      renderer="antialias: true; alpha: true"
    >
      <a-camera gps-camera rotation-reader></a-camera>
      <a-image
        src="https://cdn.glitch.global/e974619b-5809-4dcb-bd75-55d296fd7ad8/ramat_gan_theatre.jpg?v=1681841957886"
        // src="https://cdn.glitch.global/e974619b-5809-4dcb-bd75-55d296fd7ad8/merom%20nave%20square.jpg?v=1681841961730"
        look-at="[gps-camera]"
        scale="20 20 20"
        gps-entity-place="latitude: 32.08312995040869; longitude: 34.82431744074181;"
        // gps-entity-place={`latitude: ${latCoor}; longitude: ${lngCoor};`}
        // onClick={handleClick}
      >
        {" "}
        {console.log("Image loaded")}
      </a-image>
    </a-scene>
  );
};

export default ARManagement;
