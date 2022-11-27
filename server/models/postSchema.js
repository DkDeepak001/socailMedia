const mongoose = require('mongoose');


//connecting to mongoDB Cluster
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_URL}`)
.then(()=>{
    console.log('connected To Database');
})
.catch((e)=>{
    console.log("Something went wrong", e);
})


const PostSchema = new mongoose.Schema({
    postID : { 
        type:String,
        require:true,
        unique: true,
    },
    postedBy:{
        type: mongoose.SchemaTypes.ObjectId,
        ref:"User"
    },
    postTime:{
        type:Date,
        default:()=> Date.now(),
        immutable:true
    },
    imageUrl:{ 
        type:String,
        require:true,
        unique: true,
    },
    Desc:{
        type:String,
    },
    hashtag:[String],
    likedBy:{
        type:[mongoose.SchemaTypes.ObjectId],
        ref:"User",
        unique:true
    },
    likes:{
        type:Number,
        default:0
    }
})

//creating new document for storing data
const newPost = new mongoose.model("Post",PostSchema);

//exporting module
module.exports = {newPost}