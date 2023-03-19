import React from "react";
import { useLocation } from "react-router-dom";

const Print = () => {
  const { state } = useLocation();
  // console.log(state.selectedValues.select1);
  // console.log(state.selectedValues.select2);
  // console.log(state.selectedValues.select3);

  return (
    <div>
      <h1>Selected Values</h1>
      <p>Select 1: {state.selectedValues.select1}</p>
      <p>Select 2: {state.selectedValues.select2}</p>
      <p>Select 3: {state.selectedValues.select3}</p>
    </div>
  );
};

export default Print;
