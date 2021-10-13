const express = require('express')
const games = require('./games/games')

const router = express.Router()

router.use('/games', games)

module.exports = router
