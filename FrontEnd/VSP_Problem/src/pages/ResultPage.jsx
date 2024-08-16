import React, { useEffect } from "react";
import LeafletMap from "../components/LeafletMap";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import Card from "../components/Card";
import { FaTruck } from "react-icons/fa";

const ResultPage = () => {
    const result = useSelector((state) => state.result);
    const zipcodes = useSelector((state) => state.zipcodes);

    useEffect(()=>{
        console.log(result)
        console.log(zipcodes)
    },[result,zipcodes])

  return (
    <div className="min-h-screen">
      <NavBar></NavBar>
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div className="container m-2">
            <LeafletMap></LeafletMap>
        </div>
        <div className="container my-4">
            {
                result?.routes?.map((route,i)=>(
                  <div className="flex flex-row items-center">
                    <div className="flex flex-col items-center">
                      <FaTruck size={22} className="text-gray-700"/>
                      <span className="font-semibold text-gray-700"> {`Truck ${i+1}`}</span>
                    </div>
                    <Card key={i} idx={i} pincodes={route}></Card>
                  </div>
                ))
            }
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default ResultPage;
