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
} from '@chakra-ui/react'


export default function Sendotp() {
    const email = localStorage.getItem("useremail");
    console.log(email)
    const [otp, setOtp] = useState(1);
    const [success, setSuccess] = useState(0);
    const [successmsg, setMsg] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();
        const configuration = {
            method: "post",
            url: "http://localhost:3000/verify",
            data: {
                email,
                otp: otp,
            },
        };
        axios(configuration)
            .then((result) => {
                setSuccess(1)
                setMsg("Verified!")
                window.location.href = "/"
            })
            .catch((error) => {
                setSuccess(0)
                setMsg("Wrong OTP! Check your E-Mail")
                console.log(error.message)
                error = new Error();
            });

    }

    return (
        <Box position='relative' h='100%' w='100%'>
            <Center>
                <Box position='relative' h='70%' w='30%' borderWidth='1px' borderRadius='12px' p={4} bg='gray.700' >
                    <VStack spacing={5} h='100%' alignItems='center' >
                        <Text>
                            An email has been sent to your inbox with the OTP.
                        </Text>
                        {/* email */}
                        <Input type='password' name="confirmpassword" placeholder="Confirm OTP" onChange={(e) => setOtp(e.target.value)} />
                        {/* submit button */}
                        <Button colorScheme='pink' type='submit' onClick={(e) => handleSubmit(e)}>
                            Verify
                        </Button>
                        {success ? (
                            <p className="text-success">{successmsg}</p>
                        ) : (
                            <p className="text-danger">{successmsg}</p>
                        )}


                    </VStack>
                </Box>
            </Center>
        </Box>
    );
}
