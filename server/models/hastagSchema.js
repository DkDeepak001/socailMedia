const mongoose = require('mongoose');


//connecting to mongoDB Cluster
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_URL}`)
.then(()=>{
    console.log('connected To Database');
})
.catch((e)=>{
    console.log("Something went wrong", e);
})


const hashTagSchema = new mongoose.Schema({
    posts:[mongoose.SchemaTypes.ObjectId],
    hashTag:String,
    count:{
        type:Number,
        default:0
    }
})

//creating new document for storing data
const newHashTag = new mongoose.model("hashTag",hashTagSchema);

//exporting module
module.exports = {newHashTag}