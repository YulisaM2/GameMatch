var express = require('express')
const posts = require('./posts')
const Game = require('../../models/game')

var router = express.Router()

router.get('/', async function (req, res) {
    const games = await Game.find({})
    res.json(games)
})

router.get('/:id', async function (req, res) {
    const game = await Game.findOne({id: req.params.id})
    res.json(game)
})

router.use('/:gameID/posts', posts)

module.exports = router
