var express = require('express')
const path = require('path')

var router = express.Router()

router.get('/', function (req, res) {
    const options = {
        root: path.join(__dirname, '../views/games'),
    }
    res.sendFile('list.html', options)
})

router.get('/:id', function (req, res) {
    const options = {
        root: path.join(__dirname, '../views/games'),
    }
    res.sendFile('single.html', options)
})

module.exports = router
