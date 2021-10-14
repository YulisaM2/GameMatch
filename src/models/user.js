const mongoose = require("mongoose");

var user_Schema = new mongoose.Schema({
    username: String,
    password: String,
    isAdmin: {
        type: Boolean,
        default: false
    },
    name: String, 
    email: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

module.exports = mongoose.model("User", user_Schema);