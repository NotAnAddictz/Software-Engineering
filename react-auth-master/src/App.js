import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Container, Col, Row } from "react-bootstrap";
import Account from "./Account";
import FreeComponent from "./FreeComponent";
import AuthComponent from "./AuthComponent";
import ProtectedRoutes from "./ProtectedRoutes";
var temp;

function App() {
  const [userdata, setUserData] = useState(" ")
  return (
    <Container>
      <Row>
        <Col className="text-center">
          
          <h1>CoC</h1>

          <section id="navigation">
            <a href="/">Home</a>
            {/* <a href="/free">Free Component</a> */}
            {/* <a href="/auth">Auth Component</a> */}
          </section>

        </Col>
      </Row>

      {/* create routes here */}
        <p className="text-danger">You Are Not Logged in{userdata}</p>
      <Routes>
        <Route exact path="/" element={<Account setUserData={setUserData}/>} /> 
        <Route exact path="/free" element={<FreeComponent/>}/>
        <Route exact path="/auth" element={<AuthComponent userdata={userdata}/>} />
      </Routes>
    </Container>
    
  );
}

export default App;
