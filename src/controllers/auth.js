var express = require('express')
const path = require('path')
const User = require('../models/user')
const passport = require('passport')

var router = express.Router()

router.get('/register', (req, res) => {
    if(req.isAuthenticated()){
        console.log('To register a new account, log out first')
        return res.redirect('/')
    }
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
            req.login(new_user, e => {
                if(e){
                    console.log(e)
                }else{
                    console.log(new_user)
                }
            })
            
            res.redirect('/')
        }
    }catch(e){
        console.log("Error: "+ e.message);
        res.redirect('/register')
    }
})

router.get('/login', (req, res) => {
    if(req.isAuthenticated()){
        console.log('You are already logged in, if you want to log in with a new account first log out')
        return res.redirect('/')
    }
    res.render('./auth/Login')
})

router.post('/login', passport.authenticate('local', { failureFlash: false, failureRedirect: '/login' }), (req, res) => {
    console.log("Logged in")
    res.redirect('/')
})

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})


router.get('/forgot', (req, res) => {
    if(req.isAuthenticated()){
        return res.redirect('/')
    }
    res.render('./auth/Forgot')
})

router.post('/forgot', async(req, res) => {
    res.send(req.body)
})



module.exports = router