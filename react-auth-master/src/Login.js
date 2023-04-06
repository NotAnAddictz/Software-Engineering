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
  Link,
} from '@chakra-ui/react'
import Cookies from "universal-cookie";
const cookies = new Cookies();

export default function Login() {

  // initial state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState(false);
  const [msg, setMsg] = useState("");

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
        if (result.data.verified === false) {
          localStorage.setItem("useremail", result.data.email);
          window.location.href = "/otp";
        }
        else {
          // redirect user to the auth page
          localStorage.setItem("user", result.data.usertype);
          localStorage.setItem("useremail", result.data.email);
          localStorage.setItem("favourites", JSON.stringify(result.data.favourites));
          setLogin(true);
          setMsg("")
          window.location.href = "/auth";
        }

      })
      .catch((error) => {


        console.log(error)
        setMsg("Email or Password is incorrect!")
        error = new Error();
      });

  };

  function handleForgotPassword() {
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
            {/* display success message */}
            {login ? (
              <p className="text-success">You Are Logged in Successfully</p>
            ) : (
              <p className="text-danger">You Are Not Logged in <br/>{msg}</p>
            )}

            <Text>
              No Account?{' '}
              <Link color='teal.500' href='/register'>
                Register Now!
              </Link>
            </Text>

          </VStack>
        </Box>
      </Center>
    </Box>
  );
}
