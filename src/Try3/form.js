import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Form = () => {
  const [select1, setSelect1] = useState("");
  const [select2, setSelect2] = useState("");
  const [select3, setSelect3] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const selectedValues = {
      select1,
      select2,
      select3,
    };
    navigate("/print", { state: { selectedValues } });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Select 1:
          <select value={select1} onChange={(e) => setSelect1(e.target.value)}>
            <option value="">--Please select an option--</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </select>
        </label>
        <br />
        <label>
          Select 2:
          <select value={select2} onChange={(e) => setSelect2(e.target.value)}>
            <option value="">--Please select an option--</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </select>
        </label>
        <br />
        <label>
          Select 3:
          <select value={select3} onChange={(e) => setSelect3(e.target.value)}>
            <option value="">--Please select an option--</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </select>
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Form;
