import React from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import ForLanding from "../assets/ForLanding.svg";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-grow flex flex-col justify-center items-center">
        <div className="flex flex-row justify-around w-full max-w-7xl p-4">
          <div className="flex flex-col justify-center items-start p-4">
            <h1 className="text-4xl font-bold mb-4">Welcome to Our Service</h1>
            <p className="text-lg mb-4 max-w-screen-sm">
              Discover the best solutions for your needs. We provide top-notch
              services to help you achieve your goals. Our team of experts is
              dedicated to delivering high-quality results that exceed your
              expectations. Whether you're looking for innovative solutions or
              reliable support, we have you covered.
            </p>
            <button
              onClick={() => navigate("/form")}
              className="px-6 py-2 my-3 bg-[#ffc220] font-medium text-lg text-gray-800 rounded-lg hover:bg-[#e6a800] transition duration-300"
            >
              Plan deliveries
            </button>
          </div>
          <div className="flex justify-center items-center">
            <img className="h-[500px] " src={ForLanding} alt="Landing" />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
