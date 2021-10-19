var express = require('express')
const path = require('path')

const PostsController = require('./posts')
const GameModel = require('../models/game')

var router = express.Router()

router.get('/', async function (req, res) {
    const games = await GameModel.find({})

    res.render('games/list', {games: games})
})

router.get('/:id', function (req, res) {
    const options = {
        root: path.join(__dirname, '../views/games'),
    }
    res.sendFile('single.html', options)
})

router.use('/:gameID/posts/', PostsController)

module.exports = router
