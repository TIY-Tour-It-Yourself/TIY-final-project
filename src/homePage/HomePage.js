import React, { useState } from "react";
import {
  MDBInput,
  MDBBtn,
  MDBCheckbox,
  MDBValidation,
  MDBValidationItem,
  MDBInputGroup,
} from "mdb-react-ui-kit";

export function App() {
  const [formValue, setFormValue] = useState({
    fname: "Mark",
    lname: "Otto",
    email: "",
    city: "",
    state: "",
    zip: "",
  });

  const onChange = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  return (
    <MDBValidation className="row g-3">
      <MDBValidationItem tooltip className="col-md-4">
        <MDBInput
          value={formValue.fname}
          name="fname"
          onChange={onChange}
          id="validationCustom01"
          required
          label="First name"
        />
      </MDBValidationItem>
      <MDBValidationItem tooltip className="col-md-4">
        <MDBInput
          value={formValue.lname}
          name="lname"
          onChange={onChange}
          id="validationCustom02"
          required
          label="Last name"
        />
      </MDBValidationItem>
      <MDBValidationItem
        tooltip
        feedback="Please choose a username."
        invalid
        className="col-md-4"
      >
        <MDBInputGroup textBefore="@">
          <input
            type="text"
            className="form-control"
            id="validationCustomUsername"
            placeholder="Username"
            required
          />
        </MDBInputGroup>
      </MDBValidationItem>
      <MDBValidationItem
        tooltip
        className="col-md-6"
        feedback="Please provide a valid city."
        invalid
      >
        <MDBInput
          value={formValue.city}
          name="city"
          onChange={onChange}
          id="validationCustom03"
          required
          label="City"
        />
      </MDBValidationItem>
      <MDBValidationItem
        tooltip
        className="col-md-6"
        feedback="Please provide a valid zip."
        invalid
      >
        <MDBInput
          value={formValue.zip}
          name="zip"
          onChange={onChange}
          id="validationCustom05"
          required
          label="Zip"
        />
      </MDBValidationItem>
      <div className="col-12">
        <MDBBtn type="submit">Submit form</MDBBtn>
      </div>
    </MDBValidation>
  );
}
