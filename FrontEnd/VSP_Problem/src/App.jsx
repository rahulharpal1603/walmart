import "./App.css";
import React from "react";
import NavBar from "./components/NavBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ResultPage from "./pages/ResultPage";
import LandingPage from "./pages/LandingPage";


function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage></LandingPage>}></Route>
          <Route path="/form" element={<Home></Home>}></Route>
          <Route path="/result" element={<ResultPage></ResultPage>}></Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
