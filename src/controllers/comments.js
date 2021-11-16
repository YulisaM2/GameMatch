var express = require('express');

const { isLoggedIn, isCommentAuthorOrAdmin } = require('../middleware');
const { handle } = require('./util/util');

const CommentModel = require('../models/comment');
const PostModel = require('../models/post');

var router = express.Router({ mergeParams: true });

router.post('/', isLoggedIn, async function (req, res) {
    let comment = new CommentModel(req.body);

    comment.author = req.user._id;

    const [savedComment, saveCommentError] = await handle(comment.save());

    if (saveCommentError) {
        console.log(saveCommentError);

        return res.status(400).render('bad-request');
    }

    const [post, postError] = await handle(PostModel.findOne({_id: req.params.postID}).exec());

    if (postError || post === null) {
        console.log(postError);

        return res.status(404).render('not-found');
    }

    post.comments.push(savedComment._id);

    const [_, savePostError] = await handle(post.save());

    if (savePostError) {
        console.log(saveCommentError);

        return res.status(400).render('bad-request');
    }

    res.redirect(`/games/${req.params.gameID}/posts/${req.params.postID}`)
});

router.delete('/:commentID', isLoggedIn, isCommentAuthorOrAdmin, async function (req, res){
    const { commentID } = req.params;
    await CommentModel.findByIdAndDelete(commentID);
    // req.flash('success', 'Successfully deleted comment');
    res.redirect(`/games/${req.params.gameID}/posts/${req.params.postID}`)
});

module.exports = router
