var express = require('express')
const path = require('path')

var router = express.Router()

router.get('/', function (req, res) {  
    if(!req.isAuthenticated()){
        res.render('home/landing-page', {page: 'landing'})
    }else{
        res.redirect('/games')
    }
})

module.exports = router
