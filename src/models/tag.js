const mongoose = require("mongoose");

var tag_Schema = new mongoose.Schema({
    name: String,
});

module.exports = mongoose.model("Tag", tag_Schema);