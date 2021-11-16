var express = require('express')

const { isLoggedIn, isCommentAuthorOrAdmin } = require('../middleware');

const CommentModel = require('../models/comment');
const PostModel = require('../models/post')

var router = express.Router({ mergeParams: true })

router.post('/', isLoggedIn, async function (req, res) {
    let comment = new CommentModel(req.body);
    comment.author = req.user._id;
    comment = await comment.save();

    const post = await PostModel.findOne({_id: req.params.postID});
    post.comments.push(comment._id);
    await post.save();

    res.redirect(`/games/${req.params.gameID}/posts/${req.params.postID}`)
});

router.delete('/:commentID', isLoggedIn, isCommentAuthorOrAdmin, async function (req, res){
    const { commentID } = req.params;
    await CommentModel.findByIdAndDelete(commentID);
    // req.flash('success', 'Successfully deleted comment');
    res.redirect(`/games/${req.params.gameID}/posts/${req.params.postID}`)
});

module.exports = router
