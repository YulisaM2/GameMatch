var express = require('express')
const path = require('path')

var router = express.Router()

router.get('/', function (req, res) {
    const options = {
        root: path.join(__dirname, '../views/home'),
    }
    res.sendFile('home.html', options)
})

module.exports = router
