const express = require('express');
require('dotenv').config();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fileUpload = require('express-fileupload');
const { v4: uuidv4 } = require('uuid');


//importing DB schema and functions
const newUser = require("./models/newUser");
const newPost = require("./models/newPost");
const  fetchHashtagFeed  = require('./models/fetchHashtag');
const like = require('./models/likePost');
const save = require('./models/savePost');



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
                res.status(200).json({status : "ok" ,message:"User Authenticated Sucessfully", token : response.token,userId : response.userId});
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
            return res.status(200).json({fileName : fileName,filePath : `uploads/${fileName}`})
            // file.mv(`./uploads/${fileName}`,(err) => {
            //     if(err){
            //         console.log(err);
            //         return res.status(500).json({status:"error"})
            //     }
            // })
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
//API Endpoint for saved feeds
app.route('/fetchSavedPost/:userId')
.get(async(req,res) => {
        const response = await newPost.fetchSavedPost(req.params.userId)
        if(response.error){
            res.status(400).json(response);
        }else{
            res.status(200).json(response);
        }
    })


//API Endpoint for Hashtag feed fetchinng
app.route("/fetchHashTag/:tag")
    .get(async(req,res) => {
        if(!req.params.tag) return res.status(400).json({error:"error",message:"invalid Tag"})
        const response = await fetchHashtagFeed.fetchHashtagFeed(req.params.tag);
        if(response.error){
            res.status(400).json({error:"error",message:"invalid Tag"})
        }else{
            res.status(200).json(response);
        }
    })


//API endpoint for trending
app.route("/trending")
    .get(async(req,res) => {
        const response = await fetchHashtagFeed.fetchTrending();
        if(response.error){
            res.status(400).json({error:"error",message:"unknow error"})
        }else{
            res.status(200).json(response);
        }
    })

//ApI Endpoint for like post
app.route("/like")
    .post(async(req,res) => {
        const response = await like.likePost(req.body.data);
        // console.log(response)
        if(response.error){
            res.status(400).json({error:"error",message:"unknow error"})
        }else{
            res.status(200).json(response);
        }
    })

//ApI Endpoint for saved post
app.route("/save")
    .post(async(req,res) => {
        const response = await save.savePost(req.body.data);
        if(response.error){
            res.status(400).json({error:"error",message:"unknow error"})
        }else{
            res.status(200).json(response);
        }
    })

//started server on port 
app.listen(process.env.PORT || 4000,() => {
    console.log(`server started at ${process.env.PORT}`)
})