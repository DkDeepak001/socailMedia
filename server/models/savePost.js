const {newPost} = require('./postSchema');
const {newUser} = require('./userSchema')

exports.savePost = async (data) => {
    try {
        const {userId,postId} = data;
        const isAlreadyLiked = await newPost.findById(postId);
        const liked = (isAlreadyLiked.savedBy.includes(userId));
        if(!liked){
            await newPost.findByIdAndUpdate(postId,{$push:{savedBy:userId}});
            await newUser.findByIdAndUpdate(userId,{$push:{savedPost:postId}});
            return {status:'ok',message:'saved'}
        }else{
            await newPost.findByIdAndUpdate(postId,{$pull:{savedBy:userId}});
            await newUser.findByIdAndUpdate(userId,{$pull:{savedPost:postId}});
            return {status:'ok',message:'unsaved'}
        }
    } catch (error) {
        console.log(error)
        return{error:error}
    }
}

