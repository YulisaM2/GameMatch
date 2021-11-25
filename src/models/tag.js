const mongoose = require("mongoose");

var tag_Schema = new mongoose.Schema({
    name: String,
    // createdAt: {
    //     type: Date,
    //     default: Date.now
    // }
});

module.exports = mongoose.model("Tag", tag_Schema);