var express = require('express');
const router = express.Router();
const User = require("../../models/user");
const nodemailer = require("nodemailer");
const crypto = require("crypto");





// WIP
// 1. Need to update errors (if we are using flash or how to notify user about them)
// 2. Need to update redirect routes
// 3. Need to update files to render
router.post('/forgot-password', function(req, res, next) {
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
            return res.redirect("/forgot-password");
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
            pass: process.env.GMAILPW
          }
        });
        var mailOptions = {
          to: user.email,
          from: process.env.GMAIL,
          subject: 'GameMatch: Reset Password',
          text: "You are receiving this email because there has been a request to change your password for your GameMatch's account.\n\n" +
            "Click on the following link to get redirected and continue the process:\n\n" +
            "http://" + req.headers.host + "/reset-password/" + token + "\n\n" +
            "If you did not requested this, please ignore this email.\n"
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          done(err, 'done');
        });
      }
    ], function(err) {
      if (err) return next(err);
      res.redirect("/forgot-password");
    });
  });
  
  router.get('/reset-password/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        return res.redirect('/forgot-password');
      }
      res.render("reset", {token: req.params.token});
    });
  });
  
  router.post('/reset-password/:token', function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            return res.redirect("back");
          }
          if(req.body.password === req.body.confirm) {
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
              return res.redirect("back");
          }
        });
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: process.env.GMAIL,
            pass: process.env.GMAILPW
          }
        });
        var mailOptions = {
          to: user.email,
          from: process.env.GMAIL,
          subject: 'GameMatch: Your password has been reset',
          text: 'Hello there,\n\n' +
            'The password to your account registered under ' + user.email + ' has been updated successfully.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          done(err);
        });
      }
    ], function(err) {
      res.redirect("/login");
    });
  });

  module.exports = router;