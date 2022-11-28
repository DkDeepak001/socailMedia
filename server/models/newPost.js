const {newPost} = require('./postSchema');
const {newHashTag} = require('./hastagSchema');
const {newUser} = require('./userSchema')

exports.Post = async(data) => {
    try {
     const {postID,postedBy,imageUrl,hashTags,Desc} = data;
     const hashtagArray = (hashTags.split(','))
     const post = await newPost.create({
        postID : postID,
        postedBy:postedBy,
        imageUrl:imageUrl,
        hashtag:hashtagArray,
        Desc:Desc,
     })
     const posted = await post.save();

     const updatePostInUser = await newUser.findByIdAndUpdate(postedBy,{$push:{posts:posted._id}})
     
     hashtagArray.map(async (e) => {
        const isHashTag = await newHashTag.exists({hashTag:e});
        if(!isHashTag){
            const hashtag = await newHashTag.create({
                posts:posted._id,
                hashTag:e,
            })
            await hashtag.save()
        }else{
            const id = isHashTag._id;
            const hashTag = await newHashTag.findOneAndUpdate({hashTag:e},{$push:{posts:posted._id}, $inc : {count : 1}})
        }

    })

     return {status:'ok',message:"posted"}
    } catch (error) {
        return {error:error}
    }
}

exports.fetchAllFeed = async (data) => {
    try {
        const fetchData = await newPost.find({}).populate('postedBy','userName profileUrl').sort({postTime:-1});
        return {status:'ok',data:fetchData};
    } catch (error) {
        return {error:error}
    }
}

exports.fetchSavedPost = async (data) => {
    try {
        // populate({path:'posts' ,select:'imageUrl likes',populate:{path:'postedBy',select: 'userName profileUrl'}})
        const fetchSaved = await newUser.findById(data,'userName profilePic').populate({path:'savedPost',populate:{path:'postedBy',select:'userName profileUrl'}})
        console.log(fetchSaved)
        return{status:'ok',data:fetchSaved}
    } catch (error) {
        return{error:error}
    }
}