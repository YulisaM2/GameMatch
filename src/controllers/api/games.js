var express = require('express')
const Game = require('../../models/game')

var router = express.Router()

router.get('/', async function (req, res) {
    const games = await Game.find({})
    res.json(games)
})

router.get('/:id', async function (req, res) {
    const game = await Game.find({id: req.params.id})
    res.json(game)
})

module.exports = router
