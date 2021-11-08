var express = require('express')
const path = require('path')
const User = require('../models/user')

var router = express.Router()

// router.get('/fakeUser', async (req, res) => {
//     const user = new User({email: 'prueba2@gmail.com', username: 'prueba2', name:'Prueba2'})
//     const newUser = await User.register(user, 'test')
//     res.send(newUser)
// })

router.get('/register', (req, res) => {
    res.render('./auth/Register')
})

router.post('/register', async(req, res) => {
    res.send(req.body)
})

router.get('/login', (req, res) => {
    res.render('./auth/Login')
})

router.post('/login', async(req, res) => {
    res.send(req.body)
})

router.get('/forgot', (req, res) => {
    res.render('./auth/Forgot')
})

router.post('/forgot', async(req, res) => {
    res.send(req.body)
})



module.exports = router