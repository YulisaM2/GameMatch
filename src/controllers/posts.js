var express = require('express')
const path = require('path')

const PostModel = require('../models/post');
const CommentModel = require('../models/comment');

var router = express.Router()

router.get('/:postID', async (req, res) => {
    let post = await PostModel.findOne({_id: req.params.postID});
    post = await post.populate(['game', 'tags', 'comments']);

    res.render('posts/single', {post})
});

router.post('/', function (req, res) {
    console.log("post /api/posts req.body: ", req.body);
    PostModel.save(req.body);
    const post = new PostModel(req.body);

    res.render('posts/single', {post})
})

module.exports = router
