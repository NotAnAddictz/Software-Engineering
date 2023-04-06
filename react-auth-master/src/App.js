import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Container, Col, Row } from "react-bootstrap";
import Account from "./Account";
import FreeComponent from "./FreeComponent";
import AuthComponent from "./AuthComponent";
import TaxiComponent from "./TaxiComponent";
import PublicTransComponent from "./PublicTransComponent";
import Login from "./Login";
import EditProfile from "./EditProfile";
import Sendotp from "./sendotp";
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
  AbsoluteCenter,
  Spacer,
} from '@chakra-ui/react'
import Cookies from "universal-cookie";

import companyLogo from './assets/logo.png';
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
const cookies = new Cookies();
const logout = () => {
  // destroy the cookie
  cookies.remove("TOKEN", { path: "/" });
  // redirect user to the landing page
  localStorage.clear();
  window.location.href = "/";
}

const editprofile = () => {
  // redirect user to the landing page
  localStorage.removeItem("user")
  window.location.href = "/editprofile";
}


function App() {
  const location = useLocation()

  const [userdata, setUserData] = useState(" ")
  return (
    <>
      <Box position='relative' w='100%' paddingRight="2" paddingLeft="2">
        <HStack w="100%" h="100px" alignContent='right'>
          {location.pathname !== "/" && location.pathname !== "/register" && location.pathname !== "/forgotpw" && location.pathname !== "/editprofile" && location.pathname !== "/otp" &&
            <Button colorScheme='teal' type='submit' onClick={editprofile}>
              Edit Profile
            </Button>
          }
          <AbsoluteCenter axis="both">
            <Flex
              position='relative'
              flexDirection='row'
              alignItems='center'
            >
              <img src={companyLogo} style={{ height: '100px', alignSelf: 'center' }} />
            </Flex>
          </AbsoluteCenter>
          <Spacer />
          {location.pathname !== "/" && location.pathname !== "/register" && location.pathname !== "/forgotpw" &&
            <Button colorScheme='teal' type='submit' onClick={logout}>
              Logout
            </Button>
          }
        </HStack>
      </Box>

      {/* create routes here */}
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/free" element={<FreeComponent />} />
        <Route exact path="/auth" element={<AuthComponent userdata={userdata} />} />
        <Route exact path="/taxi" element={<TaxiComponent />} />
        <Route exact path="/publictrans" element={<PublicTransComponent />} />
        <Route exact path="/editprofile" element={<EditProfile />} />
        <Route exact path="/forgotpw" element={<ForgotPassword />} />
        <Route exact path="/otp" element={<Sendotp />} />
      </Routes>
    </>
  );
}

export default App;
