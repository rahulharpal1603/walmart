import React from "react";
import { HiOutlineArrowLongRight } from "react-icons/hi2";
import wareHouse from "../assets/warehouse.png";
import { useSelector } from "react-redux";

const WarehouseIcon = () => (
  <img src={wareHouse} alt="warehouse" width="30" height="30" />
);

const LocationPin = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 0C7.58 0 4 3.58 4 8c0 5.5 8 16 8 16s8-10.5 8-16c0-4.42-3.58-8-8-8zm0 12c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
      fill="#FFA500"
    />
  </svg>
);

const Arrow = () => <HiOutlineArrowLongRight color="black" size={55} />;

const Card = ({pincodes,idx}) => {

    const zipcodes = useSelector((state) => state.zipcodes);

  return (
    <div
        className="shadow-md"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#E0E0E0",
        padding: "20px",
        borderRadius: "10px",
        fontSize: "17px",
        width: "100%", // Set width to 80% of the container
        margin: "16px auto", // Center the component horizontally
        maxWidth: "1200px", // Optional: set a max-width to prevent it from becoming too wide on large screens
    }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <WarehouseIcon />
        <span style={{ color: "black", marginTop: "5px" }}>{zipcodes[pincodes[0]]}</span>
      </div>

      {pincodes.slice(1, -1).map((pincode, index) => (
        <React.Fragment key={index}>
          <Arrow />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <LocationPin />
            <span style={{ color: "black", marginTop: "5px" }}>{zipcodes[pincode]}</span>
          </div>
        </React.Fragment>
      ))}

      <Arrow />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <WarehouseIcon />
        <span style={{ color: "black", marginTop: "5px" }}>
          {zipcodes[pincodes[pincodes.length - 1]]}
        </span>
      </div>
    </div>
  );
};

export default Card;
