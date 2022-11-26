import React from "react";
import Feed from "../feed/feed";
import Header from '../header/header';
import './home.css';



const Home = () => {
   

  return (
    <div className='home-container'>
        
        <Header />
        <div className='home-main'>
            <Feed />
        </div>
    </div>
    
  )
}

export default Home