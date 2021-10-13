var express = require('express')

const games = [
    {
        type: "Game",
        id: 1,
        name: "League of Legends",
        img: "https://static-cdn.jtvnw.net/ttv-boxart/League%20of%20Legends-285x380.jpg",
    },
    {
        type: "Game",
        id: 2,
        name: "Call of Duty: Warzone",
        img: "https://static-cdn.jtvnw.net/ttv-boxart/Call%20of%20Duty:%20Warzone-285x380.jpg",
    },
    {
        type: "Game",
        id: 3,
        name: "Valorant",
        img: "https://static-cdn.jtvnw.net/ttv-boxart/VALORANT-285x380.jpg",
    },
    {
        type: "Game",
        id: 4,
        name: "Battlefield: 2042",
        img: "https://static-cdn.jtvnw.net/ttv-boxart/Battlefield%202042-285x380.jpg",
    },
]

var router = express.Router()

router.get('/', function (req, res) {
    res.json(games)
})

router.get('/:id', function (req, res) {
    const game = games.find(game => game.id === req.params.id)
    res.json(game)
})

module.exports = router
