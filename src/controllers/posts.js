var express = require('express')
const path = require('path')

const PostModel = require('../models/post');
const CommentModel = require('../models/comment');

var router = express.Router({ mergeParams: true })

router.get('/:postID', async (req, res) => {
    let post = await PostModel.findOne({_id: req.params.postID});
    post = await post.populate(['game', 'tags', 'comments']);

    res.render('posts/single', {post})
});

router.post('/', async function (req, res) {
    const post = new PostModel(req.body);
    post.game = req.params.gameID;
    await post.save();

    res.render('posts/single', {post})
});

module.exports = router
