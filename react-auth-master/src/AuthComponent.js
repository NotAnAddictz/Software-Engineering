import React, { useEffect, useState, useRef } from "react";
import { Popup } from "@progress/kendo-react-popup";

import "./styles.css";

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
const places = ['places']
const cookies = new Cookies();
// get token generated on login
const token = cookies.get("TOKEN");

export default function AuthComponent() {
  const [markers, setMarkers] = useState([{ position: { lat: 41.881832, lng: -87.623177 } }])
  const userdata = localStorage.getItem("user");
  const [time_hour, setHour] = useState("")
  const [time_min, setMin] = useState("")
  const [time_date, setDate] = useState("")
  const [time_month, setMonth] = useState("")
  const [time_year, setYear] = useState("")
  const [records, setRecords] = useState({})
  const [busrecords, setBusRecords] = useState({})
  const [taxis, setTaxis] = useState([])
  const [map, setMap] = useState(/** @type google.maps.Map */(null))
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')
  const [fare, setFare] = useState('')
  const [directions, setDirections] = useState('')
  const [map_public, setMapPublic] = useState(/** @type google.maps.Map */(null))
  const [directionsResponse_public, setDirectionsResponsePublic] = useState(null)
  const [distance_public, setDistancePublic] = useState([])
  const [duration_public, setDurationPublic] = useState('')
  const [fare_public, setFarePublic] = useState('')
  const [directions_public, setDirectionsPublic] = useState('')
  const [usertypequery, setUserTypeQuery] = useState('')
  const [timequery, setTimeQuery] = useState('')

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef()
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destiantionRef = useRef()

  // set an initial state for the message we will receive after the API call
  const [message, setMessage] = useState("");


  const [show, setShow] = useState(false);
  const anchor = useRef();

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

    var today = new Date()

    setHour(today.getHours());
    setMin(today.getMinutes());
    setDate(today.getDate());
    setMonth(today.getMonth() + 1);
    setYear(today.getFullYear())
    // make the API call
    axios(configuration)
      .then((result) => {
        // assign the message in our result to the message we initialized above
        setMessage(result.data.message);
        setUserTypeQuery(userdata)

      })
      .catch((error) => {
        error = new Error();
      });

    axios
      .get('https://data.gov.sg/api/action/datastore_search?resource_id=663fe7b6-23c2-4a40-b77a-a2fa2114beff&q=' + usertypequery)
      .then((response) => {
        setRecords(response.data.result.records)
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get('https://data.gov.sg/api/action/datastore_search?resource_id=02e22317-dcd7-4dba-b665-10fed3e41c03')
      .then((response) => {
        setBusRecords(response.data.result.records)
      })
      .catch((error) => {
        console.log(error);
      });

  }, []);

  const getTaxis = () => {
    axios
      .get('  https://api.data.gov.sg/v1/transport/taxi-availability?date_time=' + time_year + "-" + (time_month < 10 ? '0' + 3 : time_month) + "-" + (time_date < 10 ? '0' + time_date : time_date) + "T" + (time_hour < 10 ? '0' + time_hour : time_hour) + "%3A" + (time_min < 10 ? '0' + time_min : time_min) + "%3A" + "00")
      .then((response) => {
        setTaxis(response.data.features[0].geometry.coordinates)
        var x;
        const temparray = [];
        for (x = 0; x < response.data.features[0].geometry.coordinates.length; x++) {
          temparray[x] = { id: x, position: { lat: response.data.features[0].geometry.coordinates[x][1], lng: response.data.features[0].geometry.coordinates[x][0] } }
        }
        setMarkers(temparray)
      })
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
    getTaxis()
  }

  async function calculateRoute_PublicTrans() {
    // getfares();
    setFarePublic(0.0)
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
    var prev = [];
    var offset = 0;
    var sum = 0.0;
    for (i = 0; i < results.routes[0].legs[0].steps.length; i++) {
      if (results.routes[0].legs[0].steps[i].transit !== undefined) {
        prev[i+offset] = ` ${results.routes[0].legs[0].steps[i].instructions}`
        var x;
        // if(time_hour<7 && time_min<45){
        if (records.length !== 0) {

          if (results.routes[0].legs[0].steps[i].transit.line.vehicle.type == "SUBWAY") {
            for (x = 0; x < records.length; x++) {
              var lastSeven = records[x].distance.substr(records[x].distance.length - 7);
              var firstfour = records[x].distance.substr(0, 3);
              var distance_record = parseFloat(lastSeven);
              var distance_lrecord = parseFloat(firstfour);
              if (isNaN(distance_lrecord)) {
                distance_lrecord = 0.0
              }
              if (distance_record > parseFloat(results.routes[0].legs[0].steps[i].distance.text) && distance_lrecord < parseFloat(results.routes[0].legs[0].steps[i].distance.text)) {

                sum += parseFloat(records[x].fare_per_ride)
                break
              }
            }
          } else {
            for (x = 0; x < records.length; x++) {
              var lastSeven = busrecords[x].distance.substr(records[x].distance.length - 7);
              var firstfour = busrecords[x].distance.substr(0, 3);
              var distance_record = parseFloat(lastSeven);
              var distance_lrecord = parseFloat(firstfour);
              if (isNaN(distance_lrecord)) {
                distance_lrecord = 0.0
              }
              if (distance_record > parseFloat(results.routes[0].legs[0].steps[i].distance.text) && distance_lrecord < parseFloat(results.routes[0].legs[0].steps[i].distance.text)) {
                if (usertypequery == "Adult") {
                  sum += parseFloat(busrecords[x].adult_card_fare_per_ride)
                } else if (usertypequery == "Senior citizen") {
                  sum += parseFloat(busrecords[x].senior_citizen_card_fare_per_ride)
                } else if (usertypequery == "Student") {
                  sum += parseFloat(busrecords[x].student_card_fare_per_ride)
                } else if (usertypequery == "Workfare transport concession") {
                  sum += parseFloat(busrecords[x].workfare_transport_concession_card_fare_per_ride)
                } else if (usertypequery == "Persons with diabilities") {
                  sum += parseFloat(busrecords[x].persons_with_disabilities_card_fare_per_ride)
                }
                break
              }
            }
          }
        }
      } else {
        var z;
        for (z = 0; z < results.routes[0].legs[0].steps[i].steps.length; z++) {
          prev[i+offset+z] = `${results.routes[0].legs[0].steps[i].steps[z].instructions}`
        }
        offset += z
      }
    }

    setFarePublic(sum / 100)
    setDirectionsPublic(strip(prev))
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
    setShow(false);
  }

  function handleTaxi() {
    setDirectionsResponsePublic(null)
    setShow(false);
    localStorage.setItem("Taxi_Directions", JSON.stringify(directionsResponse));
    localStorage.setItem("Markers", JSON.stringify(markers));
    localStorage.setItem("Price", JSON.stringify(fare));
    localStorage.setItem("Distance", JSON.stringify(distance));
    window.location.href = "/taxi"
  }

  async function handlePublicTransport() {
    setDirectionsResponse(null)
    setShow(false);
    localStorage.setItem("Public_Directions", JSON.stringify(directionsResponse_public));
    localStorage.setItem("Price Public", JSON.stringify(fare_public));
    localStorage.setItem("Distance Public", JSON.stringify(distance_public));
    localStorage.setItem("Directionslist Public", JSON.stringify(directions_public));
    window.location.href = "/publictrans"
  }

  // logout
  const logout = () => {
    // destroy the cookie
    cookies.remove("TOKEN", { path: "/" });
    // redirect user to the landing page
    localStorage.removeItem("user")
    window.location.href = "/";
  }

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GMAPS,
    libraries: places,
  })

  if (!isLoaded) {
    return <SkeletonText />
  }


  return (
    <Flex
      position='relative'
      flexDirection='column'
      alignItems='center'
      h='100vh'
      w='100vw'
    >
      {/* Google Map Box */}
      <Box position='absolute' left={0} top={0} h='85%' w='100%' p={2} borderWidth='1px' borderRadius='lg' bg='gray.600'>
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
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
          {directionsResponse_public && (
            <DirectionsRenderer directions={directionsResponse_public} />
          )}
        </GoogleMap>
        <br />
        <br ref={anchor} />
        <br />
      </Box>
      <Box
        p={3}
        borderRadius='lg'
        m={7}
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
              <Input type='text' variant='outline' bg='gray.100' _placeholder={{ opacity: 1, color: 'gray.500' }} color='black' placeholder='Origin' ref={originRef} />
            </Autocomplete>
          </Box>
          <Box flexGrow={1}>
            <Autocomplete
              options={{
                componentRestrictions: { country: "sg" },
              }}>
              <Input
                type='text'
                variant='outline' bg='gray.100' _placeholder={{ opacity: 1, color: 'gray.500' }}
                placeholder='Destination'
                color='black'
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
        <br />
      </Box>

      <Popup anchor={anchor.current} show={show} popupClass={"popup-content"}>

        <Box
          p={4}
          borderRadius='lg'
          m={3}
          bgColor='white'
          shadow='base'
          minW='container.md'
          zIndex='1'
        >
          <Flex
            position='relative'
            flexDirection='column'
            alignItems='center'

          >
            <HStack spacing={2} justifyContent='space-between'>
              <HStack spacing={4} mt={4} justifyContent='space-between'>
                <Text>Distance: {distance} </Text>
                <Text>Duration: {duration} </Text>
                <Text>Fare: {fare} </Text>

              </HStack>


              <Button colorScheme='blue' type='submit' onClick={handleTaxi}>
                Taxi
              </Button>



            </HStack>
            <br />
            <HStack spacing={2} justifyContent='space-between'>
              <HStack spacing={4} mt={4} justifyContent='space-between'>
                <Text>Distance: {distance_public} </Text>
                <Text>Duration: {duration_public} </Text>
                <Text>Fare: {fare_public} </Text>
              </HStack>
              <Button colorScheme='blue' type='submit' onClick={handlePublicTransport}>
                Public Transport
              </Button>
            </HStack>
          </Flex>
        </Box>
      </Popup>
    </Flex >
  );
}
