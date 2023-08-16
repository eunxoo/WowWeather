import React, { useState, useEffect } from "react";
import axios from "axios";

const Address = ({ latitude, longitude }) => {
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
        })
        .catch((error) => {
          console.error("Error converting coordinates:", error);
          setError("Error converting coordinates");
        });
    }
  }, [latitude, longitude]);
  return (
    <div>
      {convertedAddress && (
        <div>
          {convertedAddress.region_1depth_name && (
            <div>{convertedAddress.region_1depth_name}</div>
          )}
          {convertedAddress.region_2depth_name && (
            <div>{convertedAddress.region_2depth_name}</div>
          )}
          {convertedAddress.region_3depth_name && (
            <div>{convertedAddress.region_3depth_name}</div>
          )}
        </div>
      )}
      {/* <div>
        <label>Latitude: {latitude}</label>
      </div>
      <div>
        <label>Longitude: {longitude}</label>
      </div>
      <button onClick={handleConvertClick}>Convert</button>
      {convertedAddress && <div>Converted Address: {convertedAddress}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>} */}
    </div>
  );
};

export default Address;
