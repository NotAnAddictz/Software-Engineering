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
  const [fare, setFare] = useState('')
  const [map_public, setMapPublic] = useState(/** @type google.maps.Map */(null))
  const [directionsResponse_public, setDirectionsResponsePublic] = useState(null)
  const [distance_public, setDistancePublic] = useState('')
  const [duration_public, setDurationPublic] = useState('')
  const [fare_public, setFarePublic] = useState('')

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

  async function calculateRoutes() {
    calculateRoute()
    calculateRoute_PublicTrans()
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
    setFare(results.routes[0].fare)
  }

  async function calculateRoute_PublicTrans() {
    if (originRef.current.value === '' || destiantionRef.current.value === '') {
      return
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService()
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destiantionRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.TRANSIT,
    })
    setDirectionsResponsePublic(results)
    setDistancePublic(results.routes[0].legs[0].distance.text)
    setDurationPublic(results.routes[0].legs[0].duration.text)
    setFarePublic(results.routes[0].legs[0].steps[0].instructions)
  }

  function clearRoute() {
    setDirectionsResponse(null)
    setDistance('')
    setDuration('')
    setFare('')
    setDirectionsResponsePublic(null)
    setDistancePublic('')
    setDurationPublic('')
    setFarePublic('')
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
    libraries: ['places'],
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
              <Autocomplete
                options={{
                  componentRestrictions: { country: "sg" },
                }}>
                <Input type='text' placeholder='Origin' ref={originRef} />
              </Autocomplete>
            </Box>
            <Box flexGrow={1}>
              <Autocomplete
                options={{
                  componentRestrictions: { country: "sg" },
                }}>
                <Input
                  type='text'
                  placeholder='Destination'
                  ref={destiantionRef}
                />
              </Autocomplete>
            </Box>

            <ButtonGroup>
              <Button colorScheme='pink' type='submit' onClick={calculateRoutes}>
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
            <Text>Fare: {fare} </Text>
            <IconButton
              aria-label='center back'
              icon={<FaLocationArrow />}
              isRound
              onClick={() => {
                map.panTo(center)
                map.setZoom(12)
                map_public.panTo(center)
                map_public.setZoom(12)
              }}
            />
          </HStack>
          <br />
          <HStack spacing={4} mt={4} justifyContent='space-between'>
            <Text>Distance: {distance_public} </Text>
            <Text>Duration: {duration_public} </Text>
            <Text>Fare: {fare_public} </Text>
          </HStack>
        </Box>
        <Flex
          position='absolute'
          flexDirection='row'
          alignItems='center'
          h='35vh'
          w='70vw'
        >
            <GoogleMap
              center={center}
              zoom={12}
              mapContainerStyle={{ width: '49%', height: '100%' }}
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
              {directionsResponse_public && (
                <DirectionsRenderer directions={directionsResponse_public} />
              )}
            </GoogleMap>
            {/* <br/> */}
            <GoogleMap
              center={center}
              zoom={12}
              mapContainerStyle={{ width: '49%', height: '100%' }}
              options={{
                zoomControl: false,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
              }}
              onLoad={map => setMapPublic(map)}
            >
              {/* <Marker position={center} /> */}
              {directionsResponse_public && (
                <DirectionsRenderer directions={directionsResponse_public} />
              )}
            </GoogleMap>
          <br />
          <br />
        </Flex >
      </Box>

    </Flex >
  );
}
