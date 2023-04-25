import React from "react";
// import 'aframe';
// import 'aframe-look-at-component';
// import 'aframe-ar-nft';

const ARManagement = () => {
  const handleClick = () => {
    alert(
      "The square has been renovated and today you can find new seating areas, lots of vegetation, unique lighting, playgrounds for children, statues and uniformity in the language of the commercial signs, with the cooperation of the merchants in the area."
    );
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
        src="https://cdn.glitch.global/e974619b-5809-4dcb-bd75-55d296fd7ad8/merom%20nave%20square.jpg?v=1681841961730"
        look-at="[gps-camera]"
        scale="20 20 20"
        gps-entity-place="latitude:  32.07160708556479; longitude:  34.82826348560593;"
        onClick={handleClick}
      ></a-image>
    </a-scene>
  );
};

export default ARManagement;
