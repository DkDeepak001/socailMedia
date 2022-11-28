import React from "react";
import {Routes,Route} from "react-router-dom";
import Login from "./components/login_register/login";
import Register from "./components/login_register/register";
import Home from "./components/home/home";
import Discover from './components/discover/discover';
import NewPost from './components/newPost/newPost';
import Hashtag from "./components/hashtag/hashtag";

function App() {
 
  
  return (
    <div className="App">
      {/* intailizing routing url for app */}
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/newPost" element={<NewPost />}></Route>
        <Route path="/discover" element={<Discover />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/hashtag/:tag" element={<Hashtag />}></Route>
      </Routes>
    </div>
  );
}

export default App;
