import React, { useEffect,useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './feed.css';
import like from '../resource/like.png'
import liked from '../resource/liked.png'
import save from '../resource/save.png'
import saved from '../resource/saved.png'
import download from '../resource/download.svg'
import { saveAs } from 'file-saver'



function Feed() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userId, setUserId] = useState(localStorage.getItem('id'));
  const [feed,setFeed] = useState("");
  const [savedFeed,setSavedFeed] = useState("");
  const [refresh,setReresh] = useState(false)
  const [switchValue,setSwitchValue] = useState('4px');
  const [type,setType] = useState(true);

  const navigate =useNavigate()

  useEffect(() => {
    //validate token
    async function validateTokenApiCall() {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/validateToken`,{ headers: {"Authorization" : `Bearer ${token}`} });
        
      } catch (error) {
        //invalid token so redirect to login page
        localStorage.removeItem('id');
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
  fetchSavedPost()

  },[refresh])

  const fetchSavedPost = async () =>{
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/fetchSavedPost/${userId}`)
    if(response.status === 200){
      setSavedFeed(response.data.data.savedPost)
    }
  } catch (error) {
    console.log(error.response.data.message)
  }
  }

  

  //like post
  const likePost = async (id) => {
    try {
      const response  = await axios.post(`${process.env.REACT_APP_SERVER_URL}/like`,{
        header:{
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8'
        },
        data:{userId:userId,postId:id}
      })
      if(response.status === 200){
        setReresh(!refresh) 
      }
    } catch (error) {
      console.log(error)
    }
  }

  //handler to save post 
  const saveHandler = async (id) => {
    try {
      const response  = await axios.post(`${process.env.REACT_APP_SERVER_URL}/save`,{
        header:{
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8'
        },
        data:{userId:userId,postId:id}
      })
      if(response.status === 200){
        setReresh(!refresh) 
      }
    } catch (error) {
      console.log(error)
    }
  
  }

  const downloadHandler = async (url) => {
     saveAs(`https://socail-media-demo.dkdeepak.com/${url}`, url.split('/')[1]) // Put your image url here.
  }

function RenderFeed () {
    return <div>  
    {feed.length !== 0 ? feed.map((e,index) => <div className="post-container" key={index}>
    <div className="post-header">
      <img src={`${e.postedBy.profileUrl}`||'' }/>
      <h4 className="profile-header-name">{e.postedBy.userName}</h4>
    </div>
    <div className="post-body">
      <img className='post-body-img' src={`https://socail-media-demo.dkdeepak.com/${e.imageUrl}`}/>
      <div className="post-body-interactive">
        <div className="like"><img onClick={() => likePost(e._id)} src={e.likes !== 0 && e.likedBy.includes(localStorage.getItem('id'))?liked:like} /><h4>{e.likes} Likes</h4></div>
        <div className="save">
          <img src={e.savedBy.length !== 0 && e.savedBy.includes(localStorage.getItem('id'))?saved:save} onClick={() => saveHandler(e._id)} style={{marginRight:'15px'}}/>
          <img src={download} onClick={() => downloadHandler(e.imageUrl)}/>
        </div>
      </div>
      <p className="post-body-desc"> {e.Desc}</p>
    </div>
    <div className="post-footer">
      
      <div>
        <div className="post-footer-hashtags">
          {e.hashtag.map((x,index) => <p key={index}><Link to={`/hashtag/${x}`}>#{x}</Link></p>)}
        </div>
      </div>
    </div>
  </div>):<h2>No post found</h2>}
</div>
}

function RenderSaved(){
  return <div>
    {savedFeed.length !== 0 ? savedFeed.map((e,index) => <div className="post-container" key={index}>
    <div className="post-header">
      <img src={`${e.postedBy.profileUrl}`}/>
      <h4 className="profile-header-name">{e.postedBy.userName}</h4>
    </div>
    <div className="post-body">
      <img className='post-body-img' src={`https://socail-media-demo.dkdeepak.com/${e.imageUrl}`}/>
      <div className="post-body-interactive">
        <div className="like"><img onClick={() => likePost(e._id)} src={e.likes !== 0 && e.likedBy.includes(localStorage.getItem('id'))?liked:like} /><h4>{e.likes} Likes</h4></div>
        <div className="save">
          <img src={e.savedBy.length !== 0 && e.savedBy.includes(localStorage.getItem('id'))?saved:save} onClick={() => saveHandler(e._id)} style={{marginRight:'15px'}}/>
          <img src={download} onClick={() => downloadHandler(e.imageUrl)}/>
        </div>
      </div>
      <p className="post-body-desc"> {e.Desc}</p>
    </div>
    <div className="post-footer">
      
      <div>
        <div className="post-footer-hashtags">
          {e.hashtag.map((x,index) => <p key={index}><Link to={`/hashtag/${x}`}>#{x}</Link></p>)}
        </div>
      </div>
    </div>
  </div>):<h2>No saved Post</h2>}
  </div>
}


  return (
    <div className="feed-container">
      <div class="button-group" data-left={switchValue}>
        <button onClick={() => {setSwitchValue('4px');setType(true)}}>All Feed</button>
        <button onClick={() => {setSwitchValue('50%');setType(false)}}>Saved</button>
      </div>
      {console.log(type)}
      
      {type?<RenderFeed />:<RenderSaved />}
    </div>
  )
}

export default Feed