import React, { useEffect,useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Feed() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const navigate =useNavigate()

  useEffect(() => {
    //validate token
    async function validateTokenApiCall() {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/validateToken`,{ headers: {"Authorization" : `Bearer ${token}`} });
        
      } catch (error) {
        //invalid token so redirect to login page
        localStorage.removeItem('token');
        navigate("/login");
      }
    } 
    validateTokenApiCall();
    
  }, [])


  const handlerLogout = async(e) => {
    e.preventDefault();

    //removing token from localstorage and redirecting to login page;
    localStorage.removeItem('token');
    navigate("/login");
  }

  return (
    <div>
      <h1>feed</h1>
      <Link to="/login">Login</Link>
      <button onClick={handlerLogout}>Log out</button>
    </div>
  )
}

export default Feed