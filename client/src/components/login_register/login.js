import React, { useState } from 'react';
import './login.css';
import { Link,useNavigate}from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//login module
function Login() {
  const [userData,setUserData] = useState({userName:"",password:""});
  
  const navigate = useNavigate();
  //storing user input of eachstroke in state variable
  const handlerFormInput = (e) =>{
    setUserData((prev) => {
      return{
        ...prev,
        [e.target.name] : e.target.value
      }
    })
  }

  //submit user form to server and validating inputs
  const submitHandler = async(e) => {
    e.preventDefault();
    //alert box 
    const toastLoading = toast.loading("Please Wait");

    //api call to server
   try {
    const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/login`,{
      header:{
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data:userData
    })
    toast.update(toastLoading, {render: "Sucess",type: "success",isLoading: false,position: "top-center",autoClose: 3000,hideProgressBar: false,closeOnClick: true,progress: undefined,theme: "light"});

    if(response.status === 200){
      console.log(response.data);
      //setting token in localstorage
      localStorage.setItem('token',response.data.token);
      localStorage.setItem('id',response.data.userId);
      
      //redirect to homepage
      navigate("/")
    }
   } catch (error) {
      console.log(error.response.data.message);
      toast.update(toastLoading,{render:`${error.response.data.message}`,type: "error",isLoading: false,position: "top-center",autoClose: 3000,hideProgressBar: false,closeOnClick: true,progress: undefined,theme: "light"});

   }
  }
  return (
    <div className='main-container'>
      <ToastContainer position="top-center" autoClose={3000}limit={0} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable={false} pauseOnHover={false} theme="light" />
      <div className="register-form-container">
        <form >
          <h1 className="form-title">Login</h1>
          <div className="form-fields">
            <div className="form-field">
            <input className='login-input' type="text" placeholder="Username" name="userName" required pattern="[a-zA-Z]+" title="Name can only contain letters." onChange={handlerFormInput} value={userData.userName}/>
            </div>
            <div className="form-field">
            <input className='login-input' type={ "password"} placeholder="Password" required name="password" minLength="8" maxLength="128" onChange={handlerFormInput} value={userData.password}/>
            </div>
          </div>
          <div className="form-buttons">
            <button className="button" onClick={submitHandler}>Log In</button>
            <div className="divider">Don't have an account </div>
            <Link to="/register" className="button button-google">Sign Up</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login