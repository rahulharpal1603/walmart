import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <div>
      <div className='flex justify-between p-4 border-b-[2px] bg-slate-700 border-[#FF3366]'>
        <div className="text-white text-2xl font-semibold">
            Sparkathon
        </div>
        <div className='flex gap-4'>
            <Link className="text-white text-xl">About Us</Link>
        </div>
    </div>
    </div>
  );
};

export default NavBar;
