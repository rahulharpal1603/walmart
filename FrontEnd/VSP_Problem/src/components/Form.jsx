import React, { useState } from "react";
import axios from "axios"

const UserForm = () => {
  const [sourceZipcode, setSourceZipcode] = useState();
  const [destinations, setDestinations] = useState([
    { destZipcode: "", demand: "" },
  ]);

  const handleSourceZipcodeChange = (e) => {
    setSourceZipcode(e.target.value);
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
    const obj={
        "node_file":{
            "node":node,
            "demand":demand
        }
    }
    const res=await axios.post("https://wallmart.onrender.com/calculate-routes",obj)
    console.log(res)
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
            value={sourceZipcode}
            onChange={handleSourceZipcodeChange}
            placeholder="Source Zipcode"
          />
        </div>

        {destinations.map((dest, index) => (
          <div key={index}>
            <input
                className="m-2 h-10 w-72 p-2 rounded-lg border-gray-900 border-2"
              type="text"
              name="destZipcode"
              value={dest.destZipcode}
              onChange={(e) => handleDestinationChange(e, index)}
              placeholder="Destination Zipcode"
            />
            <input
                className="m-2 h-10 w-72 p-2 rounded-lg border-gray-900 border-2"
              type="number"
              name="demand"
              value={dest.demand}
              onChange={(e) => handleDestinationChange(e, index)}
              placeholder="Demand"
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

        <button type="button" onClick={handleAddDestination} className="text-xl text-white bg-slate-700 m-2 py-2 px-3 rounded-lg">
          Add Destination
        </button>
        <button type="submit" className="text-xl text-white bg-slate-700 m-2 py-2 px-3 rounded-lg">Submit</button>
      </form>
    </div>
    </div>
  );
};

export default UserForm;
