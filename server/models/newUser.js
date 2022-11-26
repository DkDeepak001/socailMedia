const { newUser} = require('./userSchema');
const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config({path:'../.env'})



//importing bcrypt library to hash password
const bcrypt = require('bcrypt');
const saltRounds = 10;


//storing user information in database
exports.Register =  async(data) => {
    try {
        //destructing data
        const {userName,email,password} = data;
        
        //fetching random profile picture for api
        const profilePic = await axios.get("https://xsgames.co/randomusers/avatar.php?g=pixel")
        
        //hasing password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        //checking if user already exit
        const isUser = await newUser.findOne({userName: userName});
        if(isUser === null){
            //creating user object
            const user = await newUser.create({
                userName:userName,
                password:hashedPassword,
                email:email,
                profileUrl:profilePic.request.res.responseUrl
            })
            const result = await user.save();
            return { status:'ok'}
        }else{
            return {error :"Username already exist"};
        }
    } catch (error) {
        return {error:error.message}
    }
}


//Checking data from Database
exports.Login = async(data) =>{
    try {
        const {userName, password} = data

        //checing if user name exit in database
        const isUser = await newUser.exists({userName: userName});
        
        if(isUser){
            //geting hashed password for db
            const getPassword = await newUser.findOne({userName:userName}).select('password');
            
            //compare hashed password and raw password are same
            const checkPassword = await bcrypt.compare(password, getPassword.password)
          
            if(checkPassword){
                //if  user and password are matched
                //assingin JWT token
                const token = jwt.sign({userName : userName},process.env.JWT_SCERET_PHASE);

                //after generating jwt token returing back
                if(token){
                    return {sucess :"user Authenticated" ,token : token};
                }else{
                    return {error : "Something went wrong"}
                }
            }else{
                return {error:"Invalid Password"}
            }

        }else{
            //return error
            return {error :"Invalid username"} ;
        }

        
    } catch (error) {
        return {error : error.message}
    }
}

exports.isUser = async (data) => {
    const isUserInDB =  await newUser.exists({userName:data});
    if(isUserInDB === null){
        return {error :"Invalid Token"};
    }else{
        return{ status : "ok", message:"token validated sucessfully",userName : data};
    }
}

exports.userDetails = async (data) =>{
    try {
        const findUser = await newUser.findOne({userName:data}).select('userName profileUrl')
        if(findUser === null){
            return {error : "user not found"}
        }else{
            return {status: 'ok',data:findUser}
        }
    } catch (error) {
        return {error : error.message}
    }
}
