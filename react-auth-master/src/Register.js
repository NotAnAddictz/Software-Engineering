import React, { useState } from "react";
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
  Select,
  Text,
  Link,
} from '@chakra-ui/react'
import emailjs from '@emailjs/browser';


export default function Register() {
  // initial state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [usertype, setUsertype] = useState("");
  const [register, setRegister] = useState(false);
  const [samepass, setSamePass] = useState(1);
  const [emailerr, setEmailErr] = useState(1);
  const [passerr, setPassErr] = useState(1);
  const [usererr, setUsererr] = useState(0);
  const userdata = localStorage.getItem("user");
  const [msg, setMsg] = useState("");
  const handleSubmit = (e) => {
    var x = document.getElementById("ddlViewBy");

    // prevent the form from refreshing the whole page
    e.preventDefault();
    // set configurations
    const otp = (Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000)
    const configuration = {
      method: "post",
      url: "http://localhost:3000/register",
      data: {
        email,
        password,
        usertype: x.value,
        otp: otp,
      },
    };
    var template = {
      message: otp.toString(),
      to_email: email,
    }
    // make the API call
    axios(configuration)
      .then((result) => {
        emailjs.send('service_p69ylxn', 'template_asqv3xm', template, 'SeX2nkLBpdYR9EWgH').then(function (response) {
          console.log('SUCCESS!', response.status, response.text);
          localStorage.setItem("useremail", email)
          window.location.href = "/otp"
        });
        setRegister(true)
        setMsg("")
      })
      .catch((error) => {
        setMsg("Email Already Exists!")
        error = new Error();
      });

  };

  const handleChange = (e) => {
    setEmail(e.target.value)
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(e.target.value)) {
      setEmailErr(0)
    } else {
      setEmailErr(1)
    }
  };

  const handlePassword = (e) => {
    setPassword(e.target.value)
    if (!/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/i.test(e.target.value)) {
      setPassErr(0)
    } else {
      setPassErr(1)
    }
  };

  const handleCfmPassword = (e) => {
    setConfirmPassword(e.target.value)
    if (password === e.target.value) {
      setSamePass(1);
    } else {
      setSamePass(0);
    }
  };

  function handleSelect() {
    setUsererr(1)
  }

  return (
    <Box position='relative' h='100%' w='100%'>
      <Center>
        <Box position='relative' h='70%' w='30%' borderWidth='1px' borderRadius='12px' p={4} bg='gray.700' >
          <VStack spacing={5} h='100%' alignItems='center' >
            {/* email */}
            <FormLabel>Email address</FormLabel>
            <FormControl>
              <Input type='email' name="email" value={email} placeholder="Enter email" onChange={(e) => handleChange(e)} />
            </FormControl>
            {emailerr ? (
              <p className="text-success"></p>
            ) : (
              <p className="text-danger">Invalid Email</p>
            )}
            {/* password */}
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input type='password' name="password" value={password} placeholder="Password" onChange={(e) => handlePassword(e)} />
            </FormControl>
            {passerr ? (
              <p className="text-success"></p>
            ) : (
              <p className="text-danger">Password should contain atleast one number, one uppercase and one special character</p>
            )}
            <FormControl>
              <Input type='password' name="confirmpassword" value={confirmpassword} placeholder="Confirm Password" onChange={(e) => handleCfmPassword(e)} />
            </FormControl>
            {samepass ? (
              <p className="text-success"></p>
            ) : (
              <p className="text-danger">Passwords do not match</p>
            )}
            <Select placeholder='Select User Type' bg="teal" id='ddlViewBy' onChange={handleSelect}>
              <option value='Adult' >Adult</option>
              <option value='Senior citizen'>Senior citizen</option>
              <option value='Student'>Student</option>
              <option value='Workfare transport concession'>Workfare transport concession</option>
              <option value='Persons with diabilities'>Persons with disabilities</option>
            </Select>
            {/* submit button */}
            <Button colorScheme='pink' type='submit' w='100%' isDisabled={!samepass || !passerr || !emailerr || !usererr} onClick={(e) => handleSubmit(e)}>
              Register
            </Button>


            {/* display success message */}
            {register ? (
              <p className="text-success">You Are Registered Successfully</p>
            ) : (
              <p className="text-danger">You Are Not Registered <br /> {msg}</p>
            )}
            <Text>
              Already have an account?{' '}
              <Link color='teal.500' href='/'>
                Login
              </Link>
            </Text>
          </VStack>
        </Box>
      </Center>
    </Box>
  );
}
