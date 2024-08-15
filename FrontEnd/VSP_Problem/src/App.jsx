import './App.css'
import React from 'react'
import NavBar from './components/NavBar'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Home from './pages/Home'

function App() {

  return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home></Home>}></Route>
        </Routes>
      </BrowserRouter>
  )
}

export default App
