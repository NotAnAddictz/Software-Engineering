import React, { useState } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import axios from "axios";
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
        window.location.href ="/"
      })
      .catch((error) => {
        error = new Error();
      });
  };

  return (
    <Box position='relative' h='100%' w='100%'>
      <Center>
        <Box position='relative' h='70%' w='60%' borderWidth='1px' borderRadius='lg' p={4} bg='gray.600' >
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
            <DropdownButton id="dropdown-basic-button" title="User Type">
              <Dropdown.Item onClick={(e) => setUsertype("Adult")}>Adult</Dropdown.Item>
              <Dropdown.Item onClick={(e) => setUsertype("Senior citizen")}>Senior citizen</Dropdown.Item>
              <Dropdown.Item onClick={(e) => setUsertype("Student")}>Student</Dropdown.Item>
              <Dropdown.Item onClick={(e) => setUsertype("Workfare transport concession")}>Workfare transport concession </Dropdown.Item>
              <Dropdown.Item onClick={(e) => setUsertype("Persons with diabilities")}>Persons with diabilities</Dropdown.Item>
            </DropdownButton>
            {/* submit button */}
            <Button colorScheme='pink' type='submit' onClick={(e) => handleSubmit(e)}>
              Register
            </Button>


            {/* display success message */}
            {register ? (
              <p className="text-success">You Are Registered Successfully</p>
            ) : (
              <p className="text-danger">You Are Not Registered</p>
            )}
          </VStack>
        </Box>
      </Center>
    </Box>
  );
}
