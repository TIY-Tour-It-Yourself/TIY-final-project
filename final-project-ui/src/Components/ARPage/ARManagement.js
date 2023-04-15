import React from 'react';
import React from 'react';
import 'aframe';
import 'aframe-look-at-component';
import 'aframe-ar-nft';

const AR = () => {
   return (
      <a-scene
         vr-mode-ui='enabled: false'
         cursor='rayOrigin: mouse'
         raycaster='near: 0; far: 50000'
         arjs='sourceType: webcam; videoTexture: true; debugUIEnabled: false;'
         renderer='antialias: true; alpha: true'
      >
         <a-camera gps-camera rotation-reader></a-camera>
         <a-image
            src='https://cdn.glitch.global/e974619b-5809-4dcb-bd75-55d296fd7ad8/icons8-university-64.png?v=1679573912311'
            look-at='[gps-camera]'
            scale='50 50 50'
            gps-entity-place='latitude:  32.0900204324437; longitude:  34.80273251631247;'
            onClick={() =>
               alert(
                  'בבניין מיטשל שוכנות המחלקות לתקשורת חזותית, עיצוב תעשייתי, והנדסת פלסטיקה. לצדן תמצאו כאן את דקאנט הסטודנטים, את הספרייה ומרכז הלמידה הרב-תחומי ואת משרדי אגודת הסטודנטים.'
               )
            }
         ></a-image>
      </a-scene>
   );
};

export default AR;
