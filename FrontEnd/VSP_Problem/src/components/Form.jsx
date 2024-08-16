import React, { useState } from "react";
import axios from "axios";
import {Trash }from "lucide-react"
// import { resultState,zipcodeState } from "../recoil/atoms.js";
// import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setZipcodes, setResult } from "../redux/slice.js";
import toast from "react-hot-toast";

const UserForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sourceZipcode, setSourceZipcode] = useState(" ");
  const [destinations, setDestinations] = useState([
    { destZipcode: "", demand: "" },
  ]);

  const [capacity, setCapacity] = useState(" ");

  const handleSourceZipcodeChange = (e) => {
    setSourceZipcode(e.target.value);
  };

  const handleCapacityChange = (e) => {
    setCapacity(e.target.value);
  };

  const handleDestinationChange = (e, index) => {
    const { name, value } = e.target;
    const newDestinations = [...destinations];
    newDestinations[index][name] = value;
    setDestinations(newDestinations);
  };

  const handleAddDestination = () => {
    setDestinations([...destinations, { destZipcode: "", demand: "" }]);
  };

  const handleDeleteDestination = (index) => {
    const newDestinations = [...destinations];
    newDestinations.splice(index, 1);
    setDestinations(newDestinations);
  };
  const isLastEntryValid =
  destinations.length > 0 &&
  destinations[destinations.length - 1].destZipcode.trim() !== '' &&
  destinations[destinations.length - 1].demand.trim() !== '';

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("op")
    if(sourceZipcode  ==" "){
      toast.error("Please enter Warhouse zipcode");
      return;
    }
    if(capacity == " "){
      toast.error("Please enter truck capacity");
      return;
    }
    if(destinations.length == 0){
      toast.error("Please enter atleast one destination");
      return;
    }
    
    toast.loading("Calculating routes...");
    const node = [];
    node.push(parseInt(sourceZipcode));
    const demand = [];
    demand.push(0);
    destinations.map((dest) => {
      node.push(parseInt(dest.destZipcode));
      demand.push(parseInt(dest.demand));
    });
    dispatch(setZipcodes(node));

    const obj = {
      node_file: {
        node: node,
        demand: demand,
      },
      cap: parseInt(capacity),
    };
    const res = await axios.post(
      "https://wallmart.onrender.com/calculate-routes",
      obj,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: false,
      }
    );
    dispatch(setResult(res.data));
    navigate("/result");
    toast.dismiss();
    toast.success("Routes Optimized");
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="container m- ">
        <h1 className=" text-3xl font-bold p-3">Optimize Your Logistics</h1>
        <form
          className="min-h-screen flex flex-col my-3"
          onSubmit={handleSubmit}
        >
          <div>
            <label
              className="m-2 text-xl font-semibold"
              htmlFor="truckCapacity"
            >
              Truck capacity :
            </label>
            <input
              className="m-2 h-10 w-42 p-1 rounded-lg border-gray-900 border-2"
              type="text"
              id="truckCapacity"
              value={capacity}
              onChange={handleCapacityChange}
              placeholder="23"
              required
            />
            <br />
            <label
              className="m-2 text-xl font-semibold"
              htmlFor="truckCapacity"
            >
              Warehouse pincode :
            </label>
            <input
              className="m-2 h-10 w-72 p-2 rounded-lg border-gray-900 border-2"
              type="text"
              id="sourceZipcode"
              value={sourceZipcode}
              onChange={handleSourceZipcodeChange}
              placeholder="ex 90001"
              required
            />
          </div>


          <table className=" max-w-full mt-3 mx-3 border-collapse bg-white shadow-md rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 p-3 text-lg font-semibold text-left ">
                  Sr.No
                </th>
                <th className="border border-gray-300 p-3 text-lg font-semibold text-left">
                  Zipcode
                </th>
                <th className="border border-gray-300 p-3 text-lg font-semibold text-left">
                  Demand
                </th>
                <th className="border border-gray-300 p-3 text-lg font-semibold text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {destinations.map((dest, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border border-gray-300 p-3">
                    <span className="font-medium text-gray-700">
                      {index + 1}
                    </span>
                  </td>
                  <td className="border border-gray-300 p-3">
                    <input
                      className="h-10 w-full p-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none transition ease-in-out duration-150"
                      type="text"
                      name="destZipcode"
                      value={dest.destZipcode}
                      onChange={(e) => handleDestinationChange(e, index)}
                      placeholder="Enter Zipcode"
                      required
                    />
                  </td>
                  <td className="border border-gray-300 p-3">
                    <input
                      className="h-10 w-full p-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none transition ease-in-out duration-150"
                      type="number"
                      name="demand"
                      value={dest.demand}
                      onChange={(e) => handleDestinationChange(e, index)}
                      placeholder="Enter Demand"
                      required
                    />
                  </td>
                  <td className="border border-gray-300 p-3 text-center">
                    <button
                      type="button"
                      className="px-4 py-2 text-white  focus:outline-none  transition ease-in-out duration-150"
                      onClick={() => handleDeleteDestination(index)}
                    >
                      <Trash color="black" className="h-5 w-5 hover:bg-gray-200 transition" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        
<div className=" flex">

          <button
        type="button"
        onClick={handleAddDestination}
        className={`m-2 bg-gray-700 w-fit text-white border-none rounded-lg py-2 px-4 text-lg font-semibold cursor-pointer transition-transform transform hover:bg-gray-900 active:bg-gray-700 ${
          !isLastEntryValid ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={!isLastEntryValid}
        >
        Add Destination
      </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={destinations.length == 0}
            className="m-2 bg-gray-700 w-fit text-white border-none rounded-lg py-2 px-4 text-lg font-semibold cursor-pointer transition-transform transform hover:bg-gray-900 active:bg-gray-700"
            >
            Submit
          </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
