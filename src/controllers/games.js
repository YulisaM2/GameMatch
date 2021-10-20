var express = require('express')
const path = require('path')

const PostsController = require('./posts')
const GameModel = require('../models/game')
const PostModel = require('../models/post')

var router = express.Router()

router.get('/', async function (req, res) {
    const games = await GameModel.find({})
    
    res.render('games/list', {games: games})
})

router.get('/:id', async function (req, res) {
    const game = await GameModel.findOne({_id: req.params.id})
    const posts = await PostModel.find({game: req.params.id})

    res.render('games/single', {game, posts})
})

router.use('/:gameID/posts/', PostsController)

module.exports = router
