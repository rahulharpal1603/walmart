import React, { useState } from "react";
import axios from "axios"
// import { resultState,zipcodeState } from "../recoil/atoms.js";
// import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setZipcodes, setResult } from '../redux/slice.js';

const UserForm = () => {
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const [sourceZipcode, setSourceZipcode] = useState();
  const [destinations, setDestinations] = useState([
    { destZipcode: "", demand: "" },
  ]);
  const [capacity,setCapacity]=useState();

  const handleSourceZipcodeChange = (e) => {
    setSourceZipcode(e.target.value);
  };

  const handleCapacityChange = (e) => {
    setCapacity(e.target.value)
  }

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

  

  const handleSubmit = async(event) => {
    event.preventDefault();
    const node=[];
    node.push(parseInt(sourceZipcode))
    const demand=[];
    demand.push(0);
    destinations.map((dest)=>{
        node.push(parseInt(dest.destZipcode))
        demand.push(parseInt(dest.demand))
    })
    dispatch(setZipcodes(node));

    const obj={
        "node_file":{
            "node":node,
            "demand":demand
        },
        "cap":parseInt(capacity)
    }
    const res=await axios.post("https://wallmart.onrender.com/calculate-routes",obj,{
      headers:{
        'Content-Type': 'application/json',
      },
      withCredentials:false
    })
    dispatch(setResult(res.data));
    navigate('/result')
  };

  return (
    <div className="flex flex-col justify-center items-center">
    <div className="container m-4 ">
      <form className="min-h-screen flex flex-col items-center" onSubmit={handleSubmit}>
        <div>
        <input
            className="m-2 h-10 w-72 p-2 rounded-lg border-gray-900 border-2"
            type="text"
            id="sourceZipcode"
            value={capacity}
            onChange={handleCapacityChange}
            placeholder="Capacity"
            required
          />
          <br />
          <input
            className="m-2 h-10 w-72 p-2 rounded-lg border-gray-900 border-2"
            type="text"
            id="sourceZipcode"
            value={sourceZipcode}
            onChange={handleSourceZipcodeChange}
            placeholder="Source Zipcode"
            required
          />
        </div>

        {destinations.map((dest, index) => (
          <div key={index} className="flex flex-col md:flex-row">
            <input
                className="m-2 h-10 w-72 p-2 rounded-lg border-gray-900 border-2"
              type="text"
              name="destZipcode"
              value={dest.destZipcode}
              onChange={(e) => handleDestinationChange(e, index)}
              placeholder="Destination Zipcode"
              required
            />
            <input
                className="m-2 h-10 w-72 p-2 rounded-lg border-gray-900 border-2"
              type="number"
              name="demand"
              value={dest.demand}
              onChange={(e) => handleDestinationChange(e, index)}
              placeholder="Demand"
              required
            />
            <button
              type="button"
              className="text-lg"
              onClick={() => handleDeleteDestination(index)}
            >
              Delete
            </button>
          </div>
        ))}

        <button type="button" onClick={handleAddDestination} className="m-2 bg-gray-700 text-white border-none rounded-lg py-2 px-4 text-lg font-semibold cursor-pointer transition-transform transform hover:bg-gray-900 active:bg-gray-700">
          Add Destination
        </button>
        <button type="submit" onClick={handleSubmit} disabled={destinations.length==0} className="m-2 bg-gray-700 text-white border-none rounded-lg py-2 px-4 text-lg font-semibold cursor-pointer transition-transform transform hover:bg-gray-900 active:bg-gray-700">Submit</button>
      </form>
    </div>
    </div>
  );
};

export default UserForm;
