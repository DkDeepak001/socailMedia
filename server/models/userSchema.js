const mongoose = require('mongoose');


//connecting to mongoDB Cluster
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_URL}`)
.then(()=>{
    console.log('connected To Database');
})
.catch((e)=>{
    console.log("Something went wrong", e);
})


//creating new schema for created collection
const UserSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        unique: true,
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique: true,
    },
    profileUrl:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:()=> Date.now(),
        immutable:true
    },
    posts:{
        type :[mongoose.SchemaTypes.ObjectId],
        ref:"Post"
    },
    likedPost:{
        type :[mongoose.SchemaTypes.ObjectId],
        ref:"Post",
        unique:true
    }
})

//creating new document for storing data
const newUser = new mongoose.model("User",UserSchema);

//exporting module
module.exports = {newUser}
