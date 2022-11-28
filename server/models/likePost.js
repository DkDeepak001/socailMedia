const {newPost} = require('./postSchema');
const {newUser} = require('./userSchema')

exports.likePost = async (data) => {
    try {
        const {userId,postId} = data;
        const isAlreadyLiked = await newPost.findById(postId);
        const liked = (isAlreadyLiked.likedBy.includes(userId));
        if(!liked){
            await newPost.findByIdAndUpdate(postId,{$push:{likedBy:userId},$inc : {likes : 1}});
            await newUser.findByIdAndUpdate(userId,{$push:{likedPost:postId}});
            return {status:'ok',message:'liked'}
        }else{
            await newPost.findByIdAndUpdate(postId,{$pull:{likedBy:userId},$inc : {likes : -1}});
            await newUser.findByIdAndUpdate(userId,{$pull:{likedPost:postId}});
            return {status:'ok',message:'unliked'}
        }
    } catch (error) {
        return{error:error}
    }
}

