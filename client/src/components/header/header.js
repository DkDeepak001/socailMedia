import React, { useEffect,useState } from "react";
import './header.css';
import { useNavigate,Link } from 'react-router-dom';
import logo from '../resource/icons8-duolingo-logo.svg';
import HomeLogo from '../resource/home.svg';
import DiscoverLogo from '../resource/discover.png';
import AddPostLogo from "../resource/new-post.svg";
import axios from "axios";
const Header = () => {

    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user ,setUser] = useState({userName:'',profilePic:''})
    const navigate = useNavigate()

    useEffect(() => {
        //validate token
        async function validateTokenApiCall() {
        try {
            const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/validateToken`,{ headers: {"Authorization" : `Bearer ${token}`} });
            if(response.status === 200){
                //fetching user details
                const fetchUser = await axios.get(`${process.env.REACT_APP_SERVER_URL}/fetchUser/${response.data.userName}`)
                if(fetchUser.status === 200){
                    //set the fetched details state
                    const {userName,profileUrl} = fetchUser.data.data
                    localStorage.setItem('id',fetchUser.data.data._id)
                    setUser({userName :userName ,profilePic :profileUrl});
                }else{
                    localStorage.removeItem('id');
                    localStorage.removeItem('token');
                    navigate("/login");
                }
            }
        } catch (error) {
            //invalid token so redirect to login page
            localStorage.removeItem('id');
            localStorage.removeItem('token');
            navigate("/login");
        }
        } 
        validateTokenApiCall();
    }, [token])


    const handlerLogout = async(e) => {
        e.preventDefault();
    
        //removing token from localstorage and redirecting to login page;
        localStorage.removeItem('id');
        localStorage.removeItem('token');
        navigate("/login");
      }
    

  return (
    <div className='header-container'>
        <div className='header-wrapper'>
            <div className='logo-container'>
                <img src={logo}></img>
                <h2>Memers</h2>
            </div>
            <div className='header-navLinks'>
                <Link to='/'><img src={HomeLogo}/></Link>
                <Link to='/discover'><img src={DiscoverLogo}/></Link>
                <Link to='/newPost'><img src={AddPostLogo}/></Link>
                
            </div>
            <div className='userProfile'>
                <div className='userInfo'>
                    <div className='profilePic'>
                        <img className='profileImage' src={user.profilePic}></img>
                    </div>
                    <div className='profile-name'><h3>{user.userName}</h3></div>
                </div>
                <button className='button-59' onClick={handlerLogout}>Log out</button>
            </div>
        </div>
    </div>
  )
}

export default Header