const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');

// var user_Schema = new mongoose.Schema({
//     username: String,
//     password: String,
//     isAdmin: {
//         type: Boolean,
//         default: false
//     },
//     name: String, 
//     email: String,
//     resetPasswordToken: String,
//     resetPasswordExpires: Date
// });

var user_Schema = new mongoose.Schema({
    isAdmin: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: true
    }, 
    email: {
        type: String,
        required: true,
        unique: true
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

user_Schema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", user_Schema);