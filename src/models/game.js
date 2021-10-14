const mongoose = require("mongoose");

var game_Schema = new mongoose.Schema({
    name: String,
    image: String,
});

module.exports = mongoose.model("Game", game_Schema);