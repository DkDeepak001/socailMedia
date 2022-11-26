const express = require('express');
require('dotenv').config();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fileUpload = require('express-fileupload');
const { v4: uuidv4 } = require('uuid');


//importing DB schema and functions
const newUser = require("./models/newUser");
const newPost = require("./models/newPost");



//intializing express 
const app = express();

//cros implementation
app.use(cors());

//use file upload 
app.use(fileUpload());

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

//API Route for fetch user Details
app.route('/fetchUser/:name')
    .get(async(req,res) => {
        if(!req.params.name){
            res.status(400)
        }else{
            const user = await newUser.userDetails(req.params.name);
            if(user.error){
                res.status(400).json(user);
            }else{
                res.status(200).json(user);
            }
        }
    })
    
//upload file api 
app.route("/upload")
    .post(async(req,res) => {
        if(req.files === null){
            return res.status(400).json({message:"no file selected",status:'error'})
        }
        const file = req.files.file;
        const postID = uuidv4() + req.body.id;
        const fileName = postID + file.name
        const postData = {
            postID : postID,
            postedBy:req.body.id,
            imageUrl:`uploads/${fileName}`,
            Desc : req.body.Desc,
            hashTags:req.body.hashTag
        }
        const response = await newPost.Post(postData);
        if(response.error){
            res.status(500).json({status:"error"})
        }else{
            file.mv(`../client/public/uploads/${fileName}`,(err) => {
                if(err){
                    console.log(err);
                    return res.status(500).json({status:"error"})
                }
                return res.status(200).json({fileName : fileName,filePath : `uploads/${fileName}`})
            })
        }
    })

//API Endpoint for fetching feeds
app.route('/feed')
.get(async(req,res) => {
        const response = await newPost.fetchAllFeed()
        if(response.error){
            res.status(400).json(response);
        }else{
            res.status(200).json(response);
        }
    })

//started server on port 
app.listen(process.env.PORT,() => {
    console.log(`server started at ${process.env.PORT}`)
})