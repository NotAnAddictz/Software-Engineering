import React, {useState } from "react";
import emailjs from '@emailjs/browser';
import axios from "axios";
import {
  Box,
  Button,
  Center,
  Input,
  FormControl,
  FormLabel,
  VStack,
  Text,
} from '@chakra-ui/react'

export default function ForgotPassword() {
  // initial state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [usertype, setUsertype] = useState("");
  const [reset, setReset] = useState(false);
  const [samepass, setSamePass] = useState(1);
  const [emailerr, setEmailErr] = useState(1);
  const [passerr, setPassErr] = useState(1);
  const [btnclick, setBtnClick] = useState(false);

  const handleSubmit = (e) => {
    setBtnClick(true)
    // prevent the form from refreshing the whole page
    e.preventDefault();

    // set configurations
    const configuration = {
      method: "post",
      url: "http://localhost:3000/forgotpassword",
      data: {
        email,
        password,
      },
    };

    // make the API call
    axios(configuration)
      .then((result) => {
        var template = {
          message: result.data.otp.toString(),
          to_email: email,
        }
        setReset(true)
        emailjs.send('service_p69ylxn', 'template_asqv3xm', template, 'SeX2nkLBpdYR9EWgH').then(function (response) {
          console.log('SUCCESS!', response.status, response.text);
          localStorage.setItem("useremail", email)
          window.location.href = "/otp"
        });
      })
      .catch((error) => {
        setBtnClick(false)
        error = new Error();
      });
    
  };

  const handleChange = (e) => {
    setEmail(e.target.value)
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(e.target.value)){
      setEmailErr(0)
    }else{
      setEmailErr(1)
    }
  };

  const handlePassword = (e) => {
    setPassword(e.target.value)
    if (!/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/i.test(e.target.value)){
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
            {/* email */}
            <Text as='b' fontSize='3xl'>
              Forgot Password
            </Text>
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
    
            {/* submit button */}
            <Button w='100%' colorScheme='pink' type='submit' isLoading={btnclick} isDisabled={!samepass || !passerr || !emailerr} onClick={(e) => handleSubmit(e)}>
              Reset Password
            </Button>


            {/* display success message */}
            {reset ? (
              <p className="text-success">Password Reset!</p>
            ) : (
              <p className="text-danger"></p>
            )}
          </VStack>
        </Box>
      </Center>
    </Box>
  );
}
