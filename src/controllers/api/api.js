const express = require('express')
const games = require('./games')

const router = express.Router()

router.use('/games', games)

module.exports = router
