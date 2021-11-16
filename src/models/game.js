const mongoose = require("mongoose");

var game_Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    tags: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tag",
        }],
        validate: v => (Array.isArray(v) && v.length > 0),
    },
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
