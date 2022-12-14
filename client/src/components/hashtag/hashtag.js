import React, { useEffect, useState } from 'react';
import './hashtag.css';
import Header from '../header/header';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import liked from '../resource/liked.png'


const Hashtag = () => {
  let { tag } = useParams();
  const [feed,setFeed] = useState("");
  const [postCount,setPostCount] = useState(0);
  useEffect(() =>{

    const fetchTag = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/fetchHashTag/${tag}`);
        
        if(response.status === 200){
          setFeed(response.data.data.posts)
          setPostCount(response.data.data.count);
        }
      } catch (error) {
        console.log("error",error)
      }
    }
    fetchTag();
  },[])
  return (
    <div className='home-container'>
        <Header />
        <div className='home-main-feed'>
            <div className='hashTagHeader'>
              <h2>#{tag.charAt(0).toUpperCase() + tag.slice(1)}</h2>
              <p > {postCount} Posts</p>
            </div>
            <div className="container">
              <main className="grid">
            {feed.length !== 0 && feed.map((e,index) => 
                <div className='gridBox' key={index}>
                <div className="gridBox-header">
                  <div className="post-header-hashtag">
                    <img src={e.postedBy.profileUrl}/>
                    <h3 className="profile-header-name">{e.postedBy.userName}</h3>
                  </div>
                  <div className='likeContainer'> 
                  <img src={liked} /> <h3> {e.likes} likes</h3>
                  </div>
                </div>
                  <img className='postImage' src={`https://socail-media-demo.dkdeepak.com/${e.imageUrl}`}/>
                </div>        
              )}
              </main>
           
            </div>
        </div>
    </div>
  )
}

export default Hashtag