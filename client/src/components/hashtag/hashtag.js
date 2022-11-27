import React, { useEffect, useState } from 'react';
import './hashtag.css';
import Header from '../header/header';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Hashtag = () => {
  let { tag } = useParams();
  const [feed,setFeed] = useState("");
  const [postCount,setPostCount] = useState(0);
  useEffect(() =>{

    const fetchTag = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/fetchHashTag/${tag}`);
        
        if(response.status === 200){
          console.log(response.data.data)
          setFeed(response.data.data.posts)
          setPostCount(response.data.data.count);
        }
      } catch (error) {
        console.log("error",error)
      }
    }
    fetchTag();
   
  },[])
  console.log(feed)
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
                <div className="text">
                  <div className="post-header">
                    <img src={e.postedBy.profileUrl}/>
                    <h4 className="profile-header-name">{e.postedBy.userName}</h4>
                  </div>
                </div>
                <img className='postImage' src={`http://localhost:3000/${e.imageUrl}`}/>
                </div>        
              )}
              </main>
            {/* <main className="grid">
                <div className='gridBox'>
                <div className="text">
                  <div className="post-header">
                    <img src={'https://xsgames.co/randomusers/assets/avatars/pixel/6.jpg'}/>
                    <h4 className="profile-header-name">{'DkDeepak'}</h4>
                  </div>
                </div>
                <img className='postImage' src={`http://localhost:3000/uploads/135a2a20-0080-4f4e-9d60-efb1b59f1780638183fd09be31df984bd8ee316160287_861646471518923_3158420831933405571_n.jpg`}/>
                </div>        
              </main> */}
              
            </div>
        </div>
    </div>
  )
}

export default Hashtag