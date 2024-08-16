import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/Walmart_Spark.png"

const NavBar = () => {
  return (
    <div>
      <div className='flex justify-between items-center p-4 border-b-[2px] bg-slate-700 border-[#FF3366]'>
        <div className="text-white text-2xl font-semibold flex flex-row items-center">
            <span className="m-1"><Link to={"/"}>Sparkathon</Link></span>  
            <img src={Logo} className="h-8 m-1" alt="logo" />
        </div>
        <div className='flex gap-4'>
            <Link to={"/form"} className="text-white text-xl hover:text-gray-400">Plan-Deliveries</Link>
            <Link className="text-white text-xl hover:text-gray-400">About Us</Link>
        </div>
    </div>
    </div>
  );
};

export default NavBar;
