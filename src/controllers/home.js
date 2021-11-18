var express = require('express')
const path = require('path')

var router = express.Router()

router.get('/', function (req, res) { 
    return res.sendFile("/Users/jchv99/Desktop/test/GameMatch/src/views/home/joel.html")  
    if(!req.isAuthenticated()){
        res.send("INSERT LANDING PAGE")
    }else{
        res.redirect('/games')
    }
})

module.exports = router
