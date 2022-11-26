import React, { useEffect,useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './feed.css';
import like from '../resource/like.png'
import liked from '../resource/liked.png'
import save from '../resource/save.png'
import saved from '../resource/saved.png'
import download from '../resource/download.svg'

function Feed() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [feed,setFeed] = useState("")
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
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/feed`)
      if(response.status === 200){
       setFeed(response.data.data);
      }
    } catch (error) {
      console.log(error.response.data.message)
    }
  }
  fetchFeed()
  console.log(feed)
  },[])

  const populate =async() =>{
    const response = axios.get(`${process.env.REACT_APP_SERVER_URL}/populate`)
  }

 
  return (
    <div className="feed-container">
      {feed.length !== 0 && feed.map((e,index) => <div className="post-container" key={index}>
        <div className="post-header">
          <img src={`${e.postedBy.profileUrl}`}/>
          <h4 className="profile-header-name">{e.postedBy.userName}</h4>
        </div>
        <div className="post-body">
          <img className='post-body-img' src={`http://localhost:3000/${e.imageUrl}`}/>
          <div className="post-body-interactive">
            <div className="like"><img src={like} /><h4>Likes</h4></div>
            <div className="save"><img src={save} style={{paddingRight:'5px'}}/> <img src={download}/></div>
          </div>
          <p className="post-body-desc"> {e.Desc}</p>
        </div>
        <div className="post-footer">
          
          <div>
            <div className="post-footer-hashtags">
              {e.hashtag.map(x => <p>#{x}</p>)}
            </div>
          </div>
        </div>
      </div>)}
      
     
    </div>
  )
}

export default Feed