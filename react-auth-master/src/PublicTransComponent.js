import React, { useEffect, useState, useRef } from "react";
import {
    useJsApiLoader,
    GoogleMap,
    Marker,
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
import markerimg from './assets/marker.png';

const center = { lat: 1.3500883722383386, lng: 103.81306869057929 }
const places = ['places']

export default function PublicTransComponent() {
    
    const [map, setMap] = useState(/** @type google.maps.Map */(null))
    const styles = {
        default: [],
        hide: [
            {
                featureType: "poi.business",
                stylers: [{ visibility: "off" }],
            },
            {
                featureType: "poi.attraction",
                stylers: [{ visibility: "off" }],
            },
            {
                featureType: "transit",
                elementType: "labels.icon",
                stylers: [{ visibility: "off" }],
            },
        ],
    };

    let directionsResponse = JSON.parse(localStorage.getItem("Public_Directions"));
    let fare = JSON.parse(localStorage.getItem("Price Public"));
    let distance = JSON.parse(localStorage.getItem("Distance Public"));
    let directions = JSON.parse(localStorage.getItem("Directionslist Public"));

    function clearRoute() {
        window.location.href = "/auth"
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
            alignItems='left'
            h='100vh'
            w='100vw'
        >
            {/* Google Map Box */}


            <HStack spacing={5} h='100%' alignItems='left' >
                <Box position='relative' h='70%' w='60%' borderWidth='1px' borderRadius='lg' p={4} bg='gray.600' >
                    <GoogleMap

                        center={center}
                        zoom={12}
                        mapContainerStyle={{ width: '100%', height: '97%' }}
                        options={{
                            zoomControl: false,
                            streetViewControl: false,
                            mapTypeControl: false,
                            fullscreenControl: false,
                            styles: styles["hide"],
                        }}
                        onLoad={map => setMap(map)}
                    >
                        {directionsResponse && (
                            <DirectionsRenderer directions={directionsResponse} />
                        )}
                    </GoogleMap>
                </Box>
                <Box w="35%" h="70%" borderWidth='1px' borderRadius='lg' overflow='hidden' m={6} p={2} bg='gray.600' >

                    <HStack spacing={2} alignItems={center} >
                        <ButtonGroup>
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
                    <Text bgClip="text"
                        color="white"
                        fontSize="xl"
                        fontWeight="extrabold" >
                        Distance: {distance} <br />
                        Fare: ${fare} (estimated) <br />
                        Directions: {directions}
                    </Text>
                </Box>
            </HStack>
        </Flex >
    );
}