import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import axios from "axios";

export default function Register() {
  // initial state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usertype, setUsertype] = useState("");
  const [register, setRegister] = useState(false);

  const handleSubmit = (e) => {
    // prevent the form from refreshing the whole page
    e.preventDefault();

    // set configurations
    const configuration = {
      method: "post",
      url: "http://localhost:3000/register",
      data: {
        email,
        password,
        usertype,
      },
    };

    // make the API call
    axios(configuration)
      .then((result) => {
        setRegister(true);
      })
      .catch((error) => {
        error = new Error();
      });
  };

  return (
    <>
      <h2>Register</h2>
      <Form onSubmit={(e) => handleSubmit(e)}>
        {/* email */}
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />
        </Form.Group>

        {/* password */}
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </Form.Group>
        <DropdownButton id="dropdown-basic-button" title="User Type">
          <Dropdown.Item onClick={(e) => setUsertype("Adult")}>Adult</Dropdown.Item>
          <Dropdown.Item onClick={(e) => setUsertype("Senior citizen")}>Senior citizen</Dropdown.Item>
          <Dropdown.Item onClick={(e) => setUsertype("Student")}>Student</Dropdown.Item>
          <Dropdown.Item onClick={(e) => setUsertype("Workfare transport concession ")}>Workfare transport concession </Dropdown.Item>
          <Dropdown.Item onClick={(e) => setUsertype("Persons with diabilities")}>Persons with diabilities</Dropdown.Item>
        </DropdownButton>
        {/* submit button */}
        <Button
          variant="primary"
          type="submit"
          onClick={(e) => handleSubmit(e)}
        >
          Register
        </Button>

        {/* display success message */}
        {register ? (
          <p className="text-success">You Are Registered Successfully</p>
        ) : (
          <p className="text-danger">You Are Not Registered</p>
        )}
      </Form>
    </>
  );
}
