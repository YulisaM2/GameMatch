var express = require('express')
const path = require('path')

var router = express.Router()

router.get('/', function (req, res) {   
    if(!req.isAuthenticated()){
        res.send("INSERT LANDING PAGE")
    }else{
        const options = {
            root: path.join(__dirname, '../views/home'),
        }
        res.sendFile('home.html', options)
    }
})

module.exports = router
