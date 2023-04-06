import React, {useState } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import axios from "axios";
import {
  Box,
  Button,
  Center,
  Input,
  FormControl,
  FormLabel,
  VStack,
} from '@chakra-ui/react'

export default function EditProfile() {
  // initial state
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [usertype, setUsertype] = useState("");
  const [register, setRegister] = useState(false);
  const [samepass, setSamePass] = useState(1);
  const [passerr, setPassErr] = useState(1);
  const email = localStorage.getItem("useremail");


  const handleSubmit = (e) => {
    // prevent the form from refreshing the whole page
    e.preventDefault();

    // set configurations
    const configuration = {
      method: "post",
      url: "http://localhost:3000/editprofile",
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

  const handlePassword = (e) => {
    setPassword(e.target.value)
    if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/i.test(e.target.value)){
      setPassErr(0)
    }else{
      setPassErr(1)
    }
  };

  const handleCfmPassword = (e) => {
    setConfirmPassword(e.target.value)
    if(password === e.target.value){
      setSamePass(1);
    }else{
      setSamePass(0);
    }
  };

  
  return (
    <Box position='relative' h='100%' w='100%'>
      <Center>
        <Box position='relative' h='70%' w='30%' borderWidth='1px' borderRadius='12px' p={4} bg='gray.700' >
          <VStack spacing={5} h='100%' alignItems='center' >
            {/* password */}
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input type='password' name="password" value={password} placeholder="Password" onChange={(e) => handlePassword(e)} />
            </FormControl>
            {passerr ? (
              <p className="text-success"></p>
            ) : (
              <p className="text-danger">Password should contain atleast one number and one special character</p>
            )}
            <FormControl>
              <Input type='password' name="confirmpassword" value={confirmpassword} placeholder="Confirm Password" onChange={(e) => handleCfmPassword(e)} />
            </FormControl>
            {samepass ? (
              <p className="text-success"></p>
            ) : (
              <p className="text-danger">Passwords do not match</p>
            )}
            <DropdownButton id="dropdown-basic-button" title="User Type">
              <Dropdown.Item onClick={(e) => setUsertype("Adult")}>Adult</Dropdown.Item>
              <Dropdown.Item onClick={(e) => setUsertype("Senior citizen")}>Senior citizen</Dropdown.Item>
              <Dropdown.Item onClick={(e) => setUsertype("Student")}>Student</Dropdown.Item>
              <Dropdown.Item onClick={(e) => setUsertype("Workfare transport concession")}>Workfare transport concession </Dropdown.Item>
              <Dropdown.Item onClick={(e) => setUsertype("Persons with diabilities")}>Persons with disabilities</Dropdown.Item>
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
