import React, { useEffect, useState, useRef } from "react";

// import { Button } from "react-bootstrap";
import { Container, Col, Row, Form } from "react-bootstrap";

import axios from "axios";
import Cookies from "universal-cookie";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer
} from "@react-google-maps/api"
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  SkeletonText,
  Text,
} from '@chakra-ui/react'
import { FaLocationArrow, FaTimes } from 'react-icons/fa'


const center = { lat: 1.3500883722383386, lng: 103.81306869057929 }

const cookies = new Cookies();
// get token generated on login
const token = cookies.get("TOKEN");
export default function AuthComponent() {
  const [map, setMap] = useState(/** @type google.maps.Map */(null))
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef()
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destiantionRef = useRef()

  // set an initial state for the message we will receive after the API call
  const [message, setMessage] = useState("");

  // useEffect automatically executes once the page is fully loaded
  useEffect(() => {
    // set configurations for the API call here
    const configuration = {
      method: "get",
      url: "http://localhost:3000/auth-endpoint",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };


    // make the API call
    axios(configuration)
      .then((result) => {
        // assign the message in our result to the message we initialized above
        setMessage(result.data.message);
      })
      .catch((error) => {
        error = new Error();
      });
  }, []);

  const handleSubmit = () => {
    // destroy the cookie
    cookies.remove("TOKEN", { path: "/" });
    // redirect user to the landing page
    window.location.href = "/";
  }

  async function calculateRoute() {
    if (originRef.current.value === '' || destiantionRef.current.value === '') {
      return
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService()
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destiantionRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    })
    setDirectionsResponse(results)
    setDistance(results.routes[0].legs[0].distance.text)
    setDuration(results.routes[0].legs[0].duration.text)
  }

  function clearRoute() {
    setDirectionsResponse(null)
    setDistance('')
    setDuration('')
    originRef.current.value = ''
    destiantionRef.current.value = ''
  }

  // logout
  const logout = () => {
    // destroy the cookie
    cookies.remove("TOKEN", { path: "/" });
    // redirect user to the landing page
    window.location.href = "/";
  }
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GMAPS,
  })
  if (!isLoaded) {
    return <SkeletonText />
  }


  return (
    <Flex
      position='absolute'
      flexDirection='column'
      alignItems='center'
      h='70vh'
      w='70vw'
    >
      <Box position='absolute' left={0} top={0} h='100%' w='100%'>
        {/* logout */}
        <div className="text-center">
          <Button type="submit" variant="danger" onClick={() => logout()}>
            Logout
          </Button>
          <br />
        </div>
        {/* Google Map Box */}
        <Box
          p={4}
          borderRadius='lg'
          m={4}
          bgColor='white'
          shadow='base'
          minW='container.md'
          zIndex='1'
        >
          <HStack spacing={2} justifyContent='space-between'>
            <Box flexGrow={1}>
              {/* <Autocomplete> */}
              <Input type='text' placeholder='Origin' ref={originRef} />
              {/* </Autocomplete> */}
            </Box>
            <Box flexGrow={1}>
              {/* <Autocomplete> */}
              <Input
                type='text'
                placeholder='Destination'
                ref={destiantionRef}
              />
              {/* </Autocomplete> */}
            </Box>

            <ButtonGroup>
              <Button colorScheme='pink' type='submit' onClick={calculateRoute}>
                Calculate Route
              </Button>
              <IconButton
                aria-label='center back'
                icon={<FaTimes />}
                onClick={clearRoute}
              />
            </ButtonGroup>
          </HStack>
          <HStack spacing={4} mt={4} justifyContent='space-between'>
            <Text>Distance: {distance} </Text>
            <Text>Duration: {duration} </Text>
            <IconButton
              aria-label='center back'
              icon={<FaLocationArrow />}
              isRound
              onClick={() => {
                map.panTo(center)
                map.setZoom(12)
              }}
            />
          </HStack>
        </Box>
        <GoogleMap
          center={center}
          zoom={12}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={map => setMap(map)}
        >
          {/* <Marker position={center} /> */}
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
        
      </Box>

    </Flex >
    //  <Box position={'absolute'} left={0} right = {0} h = '100%' w = '100%'>


    //  <div className="text-center">
    //    <h1>Auth Component</h1>

    //    {/* displaying our message from our API call */}
    //    <h3 className="text-danger">{message}</h3>

    //    {/* logout */}
    //    <Button type="submit" variant="danger" onClick={() => logout()}>
    //      Logout
    //    </Button>
    //    <br/>


    //    <div className="map">
    //      {/* <Button type="submit" variant="danger" onClick={() => loadmap()}>
    //        Load Map
    //      </Button> */}



    //    </div>
    //    <div className="d-flex align-items-stretch">
    //      <GoogleMap center ={center} zoom = {10} mapContainerStyle = {{width : '100%', height : '200'}} >

    //      </GoogleMap>
    //      <Container>
    //    <Row>
    //  <Form onSubmit={(e) => handleSubmit(e)}>
    //    {/* email */}
    //    <Form.Group controlId="formBasicEmail">
    //      <Form.Label>Current Location</Form.Label>
    //      <Form.Control
    //        type="email"
    //        name="email"

    //        placeholder="Enter Starting Location"
    //      />
    //    </Form.Group>

    //    {/* password */}
    //    <Form.Group controlId="formBasicPassword">
    //      <Form.Label>Destination</Form.Label>
    //      <Form.Control
    //        type="password"
    //        name="password"

    //        placeholder="Enter Destination"
    //      />
    //    </Form.Group>
    //    </Form>
    //    {/* submit button */}
    //    <Button
    //      variant="primary"
    //      type="submit"
    //      onClick={(e) => handleSubmit(e)}
    //    >
    //      Locate
    //   </Button>
    //    </Row>


    //  </Container>
    //   </div>

    //  </div>
    //  </Box>
  );
}
