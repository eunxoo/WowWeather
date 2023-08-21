import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { MdMyLocation } from "react-icons/md";

const Address = ({ latitude, longitude, hours }) => {
  const [convertedAddress, setConvertedAddress] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    if (latitude && longitude) {
      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);
      const apiUrl = `http://localhost:8000/convert?latitude=${latitude}&longitude=${longitude}`;

      axios
        .get(apiUrl)
        .then((response) => {
          const { region_1depth_name, region_2depth_name, region_3depth_name } =
            response.data.address;
          console.log(response.data.address);
          setConvertedAddress({
            region_1depth_name,
            region_2depth_name,
            region_3depth_name,
          });
          console.log(response.data.address);
        })
        .catch((error) => {
          console.error("Error converting coordinates:", error);
          setError("Error converting coordinates");
        });
    }
  }, [latitude, longitude]);
  return (
    <Container hours={hours}>
      {/* <MdMyLocation className="myLocation" /> */}
      {convertedAddress && (
        <Box>
          {convertedAddress.region_1depth_name && (
            <AddressDiv>{convertedAddress.region_1depth_name}</AddressDiv>
          )}
          {convertedAddress.region_2depth_name && (
            <AddressDiv>{convertedAddress.region_2depth_name}</AddressDiv>
          )}
          {convertedAddress.region_3depth_name && (
            <AddressDiv>{convertedAddress.region_3depth_name}</AddressDiv>
          )}
        </Box>
      )}
    </Container>
  );
};

export default Address;

const Container = styled.div`
  position: relative;
  /* display: flex;
  flex-direction: row; */
  .myLocation {
    /* position: absolute; */
  }
  color: ${({ hours }) => {
    console.log(hours);
    return (hours >= 20 && hours <= 23) || (hours >= 0 && hours <= 4)
      ? "white"
      : "black";
  }};
`;
const Box = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 5px;
  align-content: space-around;
  justify-content: center;
`;
const AddressDiv = styled.div`
  margin-right: 4px;
  font-size: 17px;
  -webkit-text-size-adjust: none;
`;
