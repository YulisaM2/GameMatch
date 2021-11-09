var express = require('express')
const path = require('path')
const User = require('../models/user')
const passport = require('passport')
const { isLoggedIn } = require('../middleware')


var router = express.Router()

router.get('/register', (req, res) => {
    res.render('./auth/Register')
})

router.post('/register', async(req, res) => {
    try{
        const {user} = req.body
        if(user.password != user.confirm_password){
            console.log("The passwords do not match.")
            res.redirect('/register')
        }else{
            const user_buffer = new User({email: user.email, username: user.username})
            const new_user = await User.register(user_buffer, user.password)
            console.log(new_user)
            res.redirect('/')
        }
    }catch(e){
        console.log("Error: "+ e.message);
        res.redirect('/register')
    }

    
})

router.get('/login', (req, res) => {
    res.render('./auth/Login')
})

router.post('/login', passport.authenticate('local', { failureFlash: false, failureRedirect: '/login' }), (req, res) => {
    console.log("Logged in")
    res.redirect('/')
})

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout()
    res.redirect('/')
})


router.get('/forgot', (req, res) => {
    res.render('./auth/Forgot')
})

router.post('/forgot', async(req, res) => {
    res.send(req.body)
})



module.exports = router