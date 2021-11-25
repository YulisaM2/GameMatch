var express = require('express')
const path = require('path')
const User = require('../models/user')
const passport = require('passport')
const async = require('async')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const { isLoggedIn } = require('../middleware')

var router = express.Router()

// router.get('/create', (req, res) =>{
//      res.render('./auth/Reset')
// })

router.get('/register', (req, res) => {
    if(req.isAuthenticated()){
        console.log('To register a new account, log out first')
        req.flash('error', 'To register a new account, log out first')
        return res.redirect('/games')
    }
    res.render('./auth/Register')
})

router.post('/register', async(req, res) => {
    try{
        const {user} = req.body
        if(user.password != user.confirm_password){
            console.log("The passwords do not match.")
            req.flash('error', 'The passwords do not match.')
            res.redirect('/register')
        }else{
            const user_buffer = new User({email: user.email, username: user.username})
            const new_user = await User.register(user_buffer, user.password)
            req.login(new_user, e => {
                if(e){
                    console.log(e)
                    req.flash('error', e.message)
                }else{
                    console.log(new_user)
                    req.flash('success', 'Welcome to GameMatch, ' + req.user.username + '!')
                }
            })
            
            res.redirect('/games')
        }
    }catch(e){
        console.log("Error: "+ e.message);
        req.flash('error', e.message)
        res.redirect('/register')
    }
})

router.get('/login',  (req, res) => {
    if(req.isAuthenticated()){
        console.log('You are already logged in, if you want to log in with a new account first log out')
        req.flash('error', 'You are already logged in, if you want to log in with a new account first log out')
        return res.redirect('/games')
    }
    res.render('./auth/Login')
})

router.post('/login', passport.authenticate('local', { failureFlash: false, failureRedirect: '/login' }), (req, res) => {
    console.log("Logged in")
    req.flash('success', 'Welcome back, ' + req.user.username + '!');
    res.redirect('/games')
})

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})


router.get('/forgot', (req, res) => {
    if(req.isAuthenticated()){
      req.flash('error', 'You are logged in, to change password logout.')  
      return res.redirect('back')
    }
    res.render('./auth/Forgot')
})

router.post('/forgot', function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
            req.flash("error", "There are no accounts registered to this address.");
            return res.redirect("/forgot");
          }
  
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 900000; // 15 minutes
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: process.env.GMAIL,
            pass: process.env.GMAIL_PWD
          }
        });
        var mailOptions = {
          to: user.email,
          from: process.env.GMAIL,
          subject: 'GameMatch: Reset your password',
          text: "You are getting this email because there has been a request to reset your GameMatch's password.\n\n" +
            "Click on the following link to continue the process:\n\n" +
            "http://" + req.headers.host + "/forgot/" + token + "\n\n" +
            "In case that you did not request this, please ignore this message.\n"
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          console.log('mail sent');
          req.flash("success", "An email to the address " + user.email + " has been sent with further instructions.");
          done(err, 'done');
        });
      }
    ], function(err) {
      if (err) return next(err);
      res.redirect("/forgot");
    });
  });
  
  router.get('/forgot/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash("error", "The token to reset your password is invalid or has expired.");
        return res.redirect('/forgot');
      }
      res.render("./auth/Reset", {token: req.params.token});
    });
  });
  
  router.post('/forgot/:token', function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash("error", "The token to reset your password is invalid or has expired.");
            return res.redirect("back");
          }
          console.log("Checking if passwords match")
          if(req.body.password === req.body.confirm) {
            console.log("Same passwords")
            user.setPassword(req.body.password, function(err) {
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
  
              user.save(function(err) {
                req.logIn(user, function(err) {
                  done(err, user);
                });
              });
            })
          } else {
              req.flash("error", "The passwords do not match.");
              return res.redirect("back");
          }
        });
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: process.env.GMAIL,
            pass: process.env.GMAIL_PWD
          }
        });
        var mailOptions = {
          to: user.email,
          from: process.env.GMAIL,
          subject: 'GameMatch: Your password has been reset',
          text: 'Hey,\n\n' +
            'This is official confirmation that the password for your account registered to ' + user.email + ' has been successfully updated.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          console.log("Password has been reset.")
          req.flash("success", "Your password has been reset.");
          done(err, 'done');
        });
      }
    ], function(err) {
      res.redirect("/games");
    });
  });



module.exports = router