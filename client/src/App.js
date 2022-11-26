import React, { useEffect,useState } from "react";
import {Routes,Route} from "react-router-dom";
import Login from "./components/login_register/login";
import Register from "./components/login_register/register";
import Feed from "./components/feed/feed";
import axios from 'axios';

function App() {
 
  
  return (
    <div className="App">
      {/* intailizing routing url for app */}
      <Routes>
        <Route path="/" element={<Feed />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
      </Routes>
    </div>
  );
}

export default App;
