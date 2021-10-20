const mongoose = require("mongoose");

var game_Schema = new mongoose.Schema({
    name: String,
    image: String,
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag"
    }],
});

module.exports = mongoose.model("Game", game_Schema);