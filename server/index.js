const express = require('express');
require('dotenv').config();
const cors = require('cors');
const jwt = require('jsonwebtoken')

//importing DB schema and functions
const newUser = require("./models/newUser");



//intializing express 
const app = express();

//cros implementation
app.use(cors());

//express to recive json data from front end
app.use(express.json());

//middleware for validate token 
function validateToken(req,res,next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token === null){
        return res.status(401).json({status:"error", message:"token not found"})
    }
    
    try {
        const tokenVerify = jwt.verify(token,process.env.JWT_SCERET_PHASE)
        if(tokenVerify){
            req.user = tokenVerify.userName;
            next()
        }else{
            return res.status(403).json({status:"error", message:"Invalid token"})
        }
    } catch (error) {
        return res.status(403).json({status:"error", message:"Invalid token"})
    }
}

//API route for validate token 
app.route("/validateToken")
    .get(validateToken , async(req,res) => {
        if(req.user){
            //valdiating user in database
            const response = await newUser.isUser(req.user);
            console.log(response)
            if(response.error){
                res.status(401).json({status:"error",message:"Invalid token"})
            }else{
                res.status(200).json(response)
            }
        }else{
            res.status(401).json({status:"error",message:"Invalid token"})
        }
    })

//API route for register 
app.route("/register")
    //post method
    .post(async(req,res) => {
        if(req.body.data){
            const response = await newUser.Register(req.body.data);
            if(response.error){
                res.status(400).json({status : "error",message:response.error});
            }else{
                res.status(200).json({status : "ok",message:"user created sucessfully"});
            }
        }else{
            throw new Error("No Data found")
        }
    })


//API route for Login
app.route("/login")
    //post method
    .post(async (req,res) => {
        if(req.body.data){
            const response = await newUser.Login(req.body.data);
            if(response.error){
                res.status(400).json({status : "error",message:response.error});
            }else{
                res.status(200).json({status : "ok" ,message:"User Authenticated Sucessfully", token : response.token});
            }
        }else{
            throw new Error("No Data found")
        }
    })


//started server on port 
app.listen(process.env.PORT,() => {
    console.log(`server started at ${process.env.PORT}`)
})