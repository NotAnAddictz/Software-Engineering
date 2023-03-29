import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Container, Col, Row } from "react-bootstrap";
import Account from "./Account";
import FreeComponent from "./FreeComponent";
import AuthComponent from "./AuthComponent";
import TaxiComponent from "./TaxiComponent";
import PublicTransComponent from "./PublicTransComponent";
import Login from "./Login";
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  HStack,
  IconButton,
  Input,
  SkeletonText,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  VStack,
} from '@chakra-ui/react'

import companyLogo from './assets/logo.png';
import Register from "./Register";

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
        </Col>
      </Row>

      {/* create routes here */}
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/register" element={<Register/>} />
        <Route exact path="/free" element={<FreeComponent />} />
        <Route exact path="/auth" element={<AuthComponent userdata={userdata} />} />
        <Route exact path="/taxi" element={<TaxiComponent />} />
        <Route exact path="/publictrans" element={<PublicTransComponent />} />
      </Routes>
    </>
  );
}

export default App;
