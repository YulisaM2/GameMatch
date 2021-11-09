const Post = require('./models/post')
const Comment = require('./models/comment')

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        console.log("You must be signed in first")
        return res.redirect('/login')
    }
    next();
}

module.exports.isPostAuthorOrAdmin = async(req, res, next) => {
    if(!req.user.isAdmin){
        const { postID } = req.params
        const post = await Post.findById(postID)
        if(!post.author.equals(req.user._id)){
            console.log('Unauthorized action')
            // return res.redirect('games/' + `/posts/${postID}`)
            return res.redirect('/')
        }
        next()
    }
    next()
}

module.exports.isCommentAuthorOrAdmin = async(req, res, next) => {
    if(!req.user.isAdmin){
        const { commentID } = req.params
        const comment = await Comment.findById(commentID)
        if(!comment.author.equals(req.user._id)){
            console.log('Unauthorized action')
            // return res.redirect('games/' + `/posts/${id}`)
            return res.redirect('/')
        }
        next()
    }
    next()
}