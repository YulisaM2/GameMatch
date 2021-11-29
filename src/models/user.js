const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');

var user_Schema = new mongoose.Schema({
    isAdmin: {
        type: Boolean,
        default: false
    },
    // name: {
    //     type: String,
    //     required: true
    // }, 
    email: {
        type: String,
        required: true,
        unique: true
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

user_Schema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", user_Schema);