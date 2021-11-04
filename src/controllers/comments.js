var express = require('express')

const CommentModel = require('../models/comment');
const PostModel = require('../models/post')

var router = express.Router({ mergeParams: true })

router.post('/', async function (req, res) {
    let comment = new CommentModel(req.body);
    comment = await comment.save();

    const post = await PostModel.findOne({_id: req.params.postID});
    post.comments.push(comment._id);
    await post.save();

    res.redirect(`/games/${req.params.gameID}/posts/${req.params.postID}`)
});

module.exports = router
