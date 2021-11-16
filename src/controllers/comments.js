var express = require('express');

const { handle } = require('./util/util');
const { isLoggedIn } = require('../middleware');

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

module.exports = router
