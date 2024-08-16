import React, { useEffect } from "react";
import LeafletMap from "../components/LeafletMap";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import Card from "../components/Card";

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
      <h1 className=" text-2xl font-bold my-5 px-2">Your optimized Routes</h1>
      <div className=" flex flex-col justify-center items-center">
        <div className="container h-full px-4">
            <LeafletMap></LeafletMap>
        </div>
        <div className="container my-4">
            {
                result?.routes?.map((route,i)=>(
                    <Card key={i} i={i} pincodes={route}></Card>
                ))
            }
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default ResultPage;
