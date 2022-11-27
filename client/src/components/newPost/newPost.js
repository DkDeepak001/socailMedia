import React, { useState } from 'react';
import Header from '../header/header';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate}from 'react-router-dom';


import './newPost.css'

function NewPost  () {
  const [file,setFile] = useState('');
  const [fileName,setFileName] = useState("choose image");

  const [Desc,setDesc] = useState("");

  const [hashTagInput,setHashTagInput] = useState("");
  const [hashtagArray , setHashTagArray] = useState([]);

  const navigate = useNavigate();
  const fileUploadHandler = (e) => {
    setFile(e.target.files[0]);
  }
  
  
  const uploadPost =  async (e) => {
    console.log("rere")
    e.preventDefault();
    //alert box 
    const toastLoading = toast.loading("Posting");
    const formData = new FormData();
    formData.append('file',file);
    formData.append('id',localStorage.getItem('id'));
    formData.append('Desc',Desc);
    formData.append('hashTag',hashtagArray);

    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/upload`,formData,{
        header:{
          'Accept': 'application/json',
          'Content-Type': 'application/form-data'
        }
      })
      if(response.status === 200){
        toast.update(toastLoading, {render: "Sucess",type: "success",isLoading: false,position: "top-center",autoClose: 3000,hideProgressBar: false,closeOnClick: true,progress: undefined,theme: "light"});
        navigate("/");
      }
    } catch (error) {
      toast.update(toastLoading,{render:`${error.response.data.message}`,type: "error",isLoading: false,position: "top-center",autoClose: 3000,hideProgressBar: false,closeOnClick: true,progress: undefined,theme: "light"});

    }

  }

const updateHashtagInput = (e) => {
  const {value} = e.target;
  setHashTagInput(value);
  
}

const addHashTagToArray = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    setHashTagArray((prev) => {return [...prev,hashTagInput]})
    setHashTagInput("")
  }
}

const removeTag = (id)=>{
  setHashTagArray(oldArray => {
    return oldArray.filter((value, i) => i !== id)
  })}

  return (
  <div >
    <Header />
      <div className='home-main'>
        <ToastContainer position="top-center" autoClose={3000}limit={0} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable={false} pauseOnHover={false} theme="light" />
          <div className='newPost-contaner'>
          <div className="frame">
          <header style={{paddingBottom:'30px'}}>Create new post</header>
          <form style={{width:'80%'}}>
          <div className="form-fields">
            <div className="form-field">
            <textarea className='login-input' rows="10"type="text" placeholder="Description" name="Description" required pattern="[a-zA-Z]+" title="Name can only contain letters." onChange= {(e) => setDesc(e.target.value)}value={Desc} style={{border: '0.5px solid #b1b1b1' , fontSize:'18px',color:'#191919'}}/>
            </div>
            <div className="wrapper">
                <input className='login-input' placeholder='Type your hashtag & click enter.' type="text" onChange={updateHashtagInput} value={hashTagInput} onKeyDown={addHashTagToArray} autoComplete="off" disabled={hashtagArray.length >= 3} style={{border: '0.5px solid #b1b1b1' , fontSize:'18px',color:'#191919'}}/>
                <div className="tag-container">
                  {hashtagArray.map((res,index) => { return <p key={index} onClick={() => removeTag(index)}  className='tag'>{res}</p>})}
              </div>
            </div>
          </div>
          <div className="form-buttons">
            <input type='file' style={{marginBottom:'20px'}} onChange={fileUploadHandler}/>

            <button className="button" type='submit' onClick={uploadPost}>Post</button>
          </div>
          </form>
          </div>
          </div>
      </div>
      
    </div>
  )
}

export default NewPost