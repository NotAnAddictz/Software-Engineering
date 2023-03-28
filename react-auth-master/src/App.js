import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Container, Col, Row } from "react-bootstrap";
import Account from "./Account";
import FreeComponent from "./FreeComponent";
import AuthComponent from "./AuthComponent";
import ProtectedRoutes from "./ProtectedRoutes";
import {Flex} from '@chakra-ui/react'

import companyLogo from './assets/logo.jpg';

function App() {
  const [userdata, setUserData] = useState(" ")
  return (
    <>
      <Row>
        <Col className="text-center">
          <Flex
            position='relative'
            flexDirection='column'
            alignItems='center'
          >
            <img src={companyLogo} style={{ height: '100px', alignSelf: 'center' }} />
          </Flex>
          {/* <section id="navigation">
            <a href="/">Home</a>
            <a href="/free">Free Component</a>
            <a href="/auth">Auth Component</a>
          </section> */}

        </Col>
      </Row>

      {/* create routes here */}
      <Routes>
        <Route exact path="/" element={<Account setUserData={setUserData} />} />
        <Route exact path="/free" element={<FreeComponent />} />
        <Route exact path="/auth" element={<AuthComponent userdata={userdata} />} />
      </Routes>
    </>

  );
}

export default App;
