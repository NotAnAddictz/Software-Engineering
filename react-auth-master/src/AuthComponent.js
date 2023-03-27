import React, { useEffect, useState, useRef } from "react";
import { Popup } from "@progress/kendo-react-popup";

import "./styles.css";

// import { Button } from "react-bootstrap";

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

export default function AuthComponent({userdata}) {
  const newuser = userdata;
  const [map, setMap] = useState(/** @type google.maps.Map */(null))
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')
  const [fare, setFare] = useState('')
  const [directions, setDirections] = useState('')
  const [map_public, setMapPublic] = useState(/** @type google.maps.Map */(null))
  const [directionsResponse_public, setDirectionsResponsePublic] = useState(null)
  const [distance_public, setDistancePublic] = useState('')
  const [duration_public, setDurationPublic] = useState('')
  const [fare_public, setFarePublic] = useState('')
  const [directions_public, setDirectionsPublic] = useState('')
  const [usertypequery, setUserTypeQuery] = useState('')

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef()
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destiantionRef = useRef()

  // set an initial state for the message we will receive after the API call
  const [message, setMessage] = useState("");


  const [show, setShow] = useState(false);
  const anchor = useRef();


  const offset = {
    left: 600,
    top: 600,
  };
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

  const getfares = () =>{
    axios
    .get('https://data.gov.sg/api/action/datastore_search?resource_id=663fe7b6-23c2-4a40-b77a-a2fa2114beff&q='+usertypequery)
    .then((response) => {
      console.log(response.data.result.total)
      console.log(userdata)})
    .catch((error) => {
      console.log(error);
    });
  }

  function strip(html) {
    let doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  }

  const handleSubmit = () => {
    // destroy the cookie
    cookies.remove("TOKEN", { path: "/" });
    // redirect user to the landing page
    window.location.href = "/";
  }

  async function calculateRoutes() {
    calculateRoute()
    calculateRoute_PublicTrans()
    setShow(true);
    setUserTypeQuery("Workfare")
    getfares();
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
    var prev = "";
    var i;
    for (i = 0; i < results.routes[0].legs[0].steps.length; i++) {
      prev = `${prev} ${results.routes[0].legs[0].steps[i].instructions}`
    }
    var dist = parseFloat(results.routes[0].legs[0].distance.text);
    var price = 3.90;
    while (dist > 10.0) {
      dist -= 0.35
      if (dist < 10.0) {
        dist = 10.0
      }
      price += 0.25
    }
    while (dist > 0.0) {
      dist -= 0.40
      if (dist < 0.0) {
        dist = 0.0
      }
      price += 0.25
    }

    setDirections(strip(prev))
    setFare(price)
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
    var i;
    var prev = "";
    for (i = 0; i < results.routes[0].legs[0].steps.length; i++) {
      if (results.routes[0].legs[0].steps[i].transit !== undefined) {
        prev = `${prev} ${results.routes[0].legs[0].steps[i].transit.line.vehicle.name}`
      }
    }
    setDirectionsPublic(prev)
    setFarePublic()
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
  const onClick = () => {
    setShow(!show);
  };

  // logout
  const logout = () => {
    // destroy the cookie
    cookies.remove("TOKEN", { path: "/" });
    // redirect user to the landing page
    window.location.href = "/";
  }
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GMAPS,
    libraries: process.env.LIBRARY,
  })
  if (!isLoaded) {
    return <SkeletonText />
  }


  return (
    <Flex
      position='absolute'
      flexDirection='row'
      alignItems='center'
      h='70vh'
      w='70vw'
    >
      <Box position='absolute' left={0} top={0} h='70vh' w='70vw'>
        {/* logout */}
        <div className="text-center">
        <p className="text-danger">You Are Not Logged in {userdata}</p>

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
        </Box>
        <Flex
          position='absolute'
          flexDirection='row'
          alignItems='center'
          h='35vh'
          w='70vw'
          ref={anchor}
        >
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
            {directionsResponse_public && (
              <DirectionsRenderer directions={directionsResponse_public} />
            )}
          </GoogleMap>
          {/* <br/> */}
          <br />
          <br />
        </Flex >
      </Box>

      <Popup anchor={anchor.current} show={show} popupClass={"popup-content"}>
        <HStack spacing={4} mt={4} justifyContent='space-between'>
          <Text>Distance: {distance} </Text>
          <Text>Duration: {duration} </Text>
          <Text>Fare: {fare} </Text>

        </HStack>
        <br />
        <HStack spacing={4} mt={4} justifyContent='space-between'>
          <Text>Distance: {distance_public} </Text>
          <Text>Duration: {duration_public} </Text>
          <Text>Fare: {newuser} </Text>
        </HStack>
      </Popup>
    </Flex >
  );
}
