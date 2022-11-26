import React, { useState } from 'react';
import {Link ,useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Register module
function Register(){
  const [userData,setUserData] = useState({userName:"",email:"",password:""})
  const navigate = useNavigate();

  //store form input in state
  const handlerFormInput = (e) =>{
    setUserData((prev) => {
      return{
        ...prev,
        [e.target.name] : e.target.value
      }
    })
  }

  //update user input to server
  const submitHandler = async (e) => {
    e.preventDefault();
    //alert box design
    const toastLoading = toast.loading("Please Wait");

   try {
     //api call to server
     const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/register`,{
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=UTF-8'
      },
      data:userData
    })
    //updating alert box  
    toast.update(toastLoading, {render: "User Created sucessfully",type: "success",isLoading: false,position: "top-center",autoClose: 3000,hideProgressBar: false,closeOnClick: true,progress: undefined,theme: "light"});
    if(response.status === 200){
        navigate("/login");
    }
   }catch (error) {
    //updating alert box  
    toast.update(toastLoading,{render:`${error.response.data.message}`,type: "error",isLoading: false,position: "top-center",autoClose: 3000,hideProgressBar: false,closeOnClick: true,progress: undefined,theme: "light"});
   }

  }
  return (
    <div className='main-container'>
     <ToastContainer position="top-center" autoClose={3000}limit={0} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable={false} pauseOnHover={false} theme="light" />
    <div className="register-form-container">
      <form >
        <h1 className="form-title">Register</h1>
        <div className="form-fields">
          <div className="form-field">
            <input className='login-input' type="text" placeholder="Username" name="userName" required pattern="[a-zA-Z]+" title="Name can only contain letters." onChange={handlerFormInput} value={userData.userName}/>
          </div>
          <div className="form-field">
            <input className='login-input' type="email" placeholder="Email" required name="email"  title="Invalid Email." onChange={handlerFormInput} value={userData.email} />
          </div>
          <div className="form-field">
            <input className='login-input' type={"password"} placeholder="Password" required name="password" minLength="8" maxLength="128" onChange={handlerFormInput} value={userData.password}/>
          </div>
        </div>
        <div className="form-buttons">
          <button className="button" onClick={submitHandler}>Sign Up</button>
          <div className="divider">Already have an account </div>
          <Link to="/login" className="button button-google">Log IN</Link>
        </div>
      </form>
    </div>
  </div>
  )
}

export default Register