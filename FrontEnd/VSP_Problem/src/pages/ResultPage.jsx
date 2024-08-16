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
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div className="container m-2">
            <LeafletMap></LeafletMap>
        </div>
        <div className="container my-4">
            {
                result?.routes?.map((route,i)=>(
                    <Card key={i} pincodes={route}></Card>
                ))
            }
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default ResultPage;
