var express = require('express');

const { isLoggedIn, isPostAuthorOrAdmin} = require('../middleware');
const { handle } = require('./util/util');

const CommentsController = require('./comments')

const PostModel = require('../models/post');

var router = express.Router({ mergeParams: true });

router.get('/:postID', async (req, res) => {
    let [post, error] = await handle(PostModel.findOne({_id: req.params.postID}).populate(['game', 'tags', 'author']).populate({path: 'comments', populate: {path: 'author'}, options: { sort: { 'createdAt': 'desc' } }}).exec());

    if (error || post === null) {
        res.status(404).render('not-found');

        return;
    }

    res.render('posts/single', {post, user: req.user});
});

router.post('/', isLoggedIn, async function (req, res) {
    const post = new PostModel(req.body);

    post.game = req.params.gameID;
    post.author = req.user._id;

    const [newPost, error] = await handle(post.save());

    if (error) {
        console.log(error);

        return res.status(400).render('bad-request');
    }
    req.flash('success', 'Post added successfully.');
    res.redirect(`/games/${req.params.gameID}/posts/${newPost._id}`);
});

router.delete('/:postID', isLoggedIn, isPostAuthorOrAdmin, async function (req, res){
    const { postID } = req.params;
    // console.log(req.params);
    await PostModel.findByIdAndDelete(postID);
    req.flash('success', 'Post deleted successfully.');
    res.redirect(`/games/${req.params.gameID}`);
});

router.use('/:postID/comments/', CommentsController);

module.exports = router;
