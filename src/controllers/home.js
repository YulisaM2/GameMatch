var express = require('express')
const path = require('path')

var router = express.Router()

router.get('/', function (req, res) {  
    if(!req.isAuthenticated()){
        //res.sendFile("/Users/jchv99/Desktop/test/GameMatch/src/views/home/joel.html") 
        res.sendFile(path.join(__dirname, '../views/home/joel.html')) 
    }else{
        res.redirect('/games')
    }
})

module.exports = router
