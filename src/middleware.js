const Post = require('./models/post')
const Comment = require('./models/comment')

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        console.log("You must be signed in first")
        req.flash('error', 'You must be signed in to do that.')
        return res.redirect('/login')
    }
    next();
}

module.exports.isPostAuthorOrAdmin = async(req, res, next) => {
    if(!req.user.isAdmin){
        const { postID } = req.params
        const post = await Post.findById(postID)
        if(!post.author._id.equals(req.user._id)){
            console.log('Unauthorized action')
            req.flash('error', 'You are not authorized to do that.');
            // return res.redirect('games/' + `/posts/${postID}`)
            return res.redirect('/')
        }
        return next()
    }
    return next()
}

module.exports.isCommentAuthorOrAdmin = async(req, res, next) => {
    if(!req.user.isAdmin){
        const { commentID } = req.params
        const comment = await Comment.findById(commentID)
        if(!comment.author._id.equals(req.user._id)){
            console.log('Unauthorized action')
            req.flash('error', 'You are not authorized to do that.');
            // return res.redirect('games/' + `/posts/${id}`)
            return res.redirect('/')
        }
        return next()
    }
    return next()
}

module.exports.isAdmin = async (req, res, next) => {
    if (req.user === undefined) {
        return res.redirect('/login');
    }

    if (!req.user.isAdmin) {
        return res.redirect('/');
    }

    next();
}

module.exports.noCache = (req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
}
