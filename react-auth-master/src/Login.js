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
  HStack,
  Spacer,
} from '@chakra-ui/react'
import Cookies from "universal-cookie";
import background from "./assets/background.gif"

const cookies = new Cookies();

export default function Login() {

  // initial state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState(false);
  const [msg, setMsg] = useState("");
  const [btnclick, setBtnClick] = useState(false);

  const handleSubmit = (e) => {
    setBtnClick(true)
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
        setBtnClick(false)
        error = new Error();
      });
  };

  function handleForgotPassword() {
    window.location.href = "/forgotpw";
  }
  return (
    <div style={{ height: '100vh', backgroundImage: `url(${background})` }}>
      <Box position='relative' h='100%' w='100%' >
        <Box position='relative' h='100px'/>
        <Center>
          <Box position='relative' h='70%' w='30%' borderWidth='1px' borderRadius='12px' borderColor='black' p={4} bg='gray.700' >
            <VStack spacing={5} h='100%' alignItems='center' >
              {/* email */}
              <HStack w='100%'>
                <FormLabel>Email address</FormLabel>
              </HStack>
              <FormControl>
                <Input type='email' name="email" value={email} placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
              </FormControl>

              {/* password */}
              <HStack w='100%'>
                <FormLabel>Password</FormLabel>
                <Spacer />
                <Text>
                  <Link color='teal.500' href='/forgotpw'>
                    Forgot Password?
                  </Link>
                </Text>
              </HStack>
              <FormControl>
                <Input type='password' name="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
              </FormControl>

              {/* submit button */}
              <Button w='100%' colorScheme='pink' isLoading={btnclick} type='submit' onClick={(e) => handleSubmit(e)}>
                Login
              </Button>

              {/* display success message */}
              {login ? (
                <p className="text-success">You Are Logged in Successfully</p>
              ) : (
                <p className="text-danger">You Are Not Logged in <br />{msg}</p>
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
    </div>
  );
}
