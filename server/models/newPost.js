const {newPost} = require('./postSchema');

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
     await post.save();
     return {status:'ok',message:"posted"}
    } catch (error) {
        return {error:error}
    }
}