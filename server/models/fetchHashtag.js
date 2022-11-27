const {newHashTag} = require('./hastagSchema');


exports.fetchHashtagFeed = async (data) => {
   try {
    const fetchData = await newHashTag.findOne({hashTag:data}).populate({path:'posts' ,select:'imageUrl likes',populate:{path:'postedBy',select: 'userName profileUrl'}});
    return {status:'ok',data:fetchData};
    
   } catch (error) {
    return {error:error}
   }
}

exports.fetchTrending = async () => {
   try {
      const response = await newHashTag.find({}).select('hashTag count').sort({count:-1})
      return {status:'ok',data:response};
   } catch (error) {
      return {error:error}
   }
}