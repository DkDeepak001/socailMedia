import React, { useEffect, useState } from 'react';
import './discover.css';
import Header from '../header/header';
import './discover.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Discover = () => {
  const[data,setData] = useState("");

  useEffect(() => {

    const fetchTrending = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/trending`)
        if(response.status === 200){
          console.log(response.data)
          setData(response.data.data)
        }else{
          throw new Error("unknow");
        }
      } catch (error) {
          console.log(error)
      }      
    }
    fetchTrending()
  },[])
  return (
    <div >
        <Header />
        <div className='trendingContainer'>
          <div className="frame">
            <header>Trending</header>
           
            <div className="score-card">
              {data.length!==0&& data.map((e,index) =>
              <Link to={`/hashTag/${e.hashTag}`}>
              <div className="leader">
                <div className="user-info">
                  <div className="number">{index + 1}</div>
                  <div className="user-name">#{e.hashTag}</div>
                </div>
                <div className="leader-post">
                  <div className="view-count">{`${e.count}  Post `}</div>
                </div>
              </div>
              </Link>)}
             
              {/* <div class="leader">
                <div class="user-info">
                  <div class="number">0</div>
                  <div class="user-name">one bro</div>
                </div>
                <div class="leader-post">
                  <div class="view-count">2.2M</div>
                  <button>view</button>
                </div>
              </div> */}
             
            </div>
          </div>
        </div>
    </div>
  )
}

export default Discover