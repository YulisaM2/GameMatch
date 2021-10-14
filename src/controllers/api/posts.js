var express = require('express')
const Post = require('../../models/post')

var router = express.Router()

router.get('/', async function (req, res) {
    console.log("got a posts api request")
    const posts = await Post.find({}).populate('tags').populate('comments').exec()
    res.json(posts)
})

router.get('/:postID', async function (req, res) {
    const post = await Post.findOne({id: req.params.id})
    res.json(post)
})

module.exports = router
