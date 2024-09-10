import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Homepage from './Components/Homepage/Homepage';
import Login from './Components/Loginpage/Login';
import Signup from './Components/Loginpage/Signup';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path='/signup' element={<Signup />} /> 
      </Routes>
    </HashRouter>
  );
}
