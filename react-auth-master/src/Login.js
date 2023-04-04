import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Center,
  Input,
  Text,
  FormControl,
  FormLabel,
  VStack,
} from '@chakra-ui/react'
import Cookies from "universal-cookie";
const cookies = new Cookies();

export default function Login({ setUserData }) {

  // initial state
  const [usertype, setUsertype] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState(false);

  const handleSubmit = (e) => {
    // prevent the form from refreshing the whole page
    e.preventDefault();

    // set configurations
    const configuration = {
      method: "post",
      url: "http://localhost:3000/login",
      data: {
        email,
        password,
      },
    };

    // make the API call
    axios(configuration)
      .then((result) => {
        // set the cookie
        cookies.set("TOKEN", result.data.token, {
          path: "/",
        });
        // redirect user to the auth page
        setUsertype(result.data.usertype)
        localStorage.setItem("user", result.data.usertype);
        localStorage.setItem("useremail", result.data.email);
        setLogin(true);
        window.location.href = "/auth";

      })
      .catch((error) => {
        error = new Error();
      });

  };
  function handleRegister() {
    window.location.href = "/register";
  }

  function handleForgotPassword(){
    window.location.href = "/forgotpw";
  }
  return (
    <Box position='relative' h='100%' w='100%'>
      <Center>
        <Box position='relative' h='70%' w='30%' borderWidth='1px' borderRadius='12px' p={4} bg='gray.700' >
          <VStack spacing={5} h='100%' alignItems='center' >
            {/* email */}
            <FormLabel>Email address</FormLabel>
            <FormControl>
              <Input type='email' name="email" value={email} placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
            </FormControl>

            {/* password */}
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input type='password' name="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            </FormControl>

            {/* submit button */}
            <Button colorScheme='pink' type='submit' onClick={(e) => handleSubmit(e)}>
              Login
            </Button>

            <Button colorScheme='pink' type='submit' onClick={handleForgotPassword}>
              Forgot Password
            </Button>

            <Text>
              No Account? Register Now!
            </Text>
            <Button colorScheme='pink' type='submit' onClick={handleRegister}>
              Register
            </Button>

            {/* display success message */}
            {login ? (
              <p className="text-success">You Are Logged in Successfully</p>
            ) : (
              <p className="text-danger">You Are Not Logged in</p>
            )}

          </VStack>
        </Box>
      </Center>
    </Box>
  );
}
