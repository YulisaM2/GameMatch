const mongoose = require("mongoose");

var game_Schema = new mongoose.Schema({
    name: String,
    image: String,
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag"
    }],
    deleted: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model("Game", game_Schema);
