const mongoose = require("mongoose");

var post_Schema = new mongoose.Schema({
    title: String, 
    description: String,
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Game",
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag"
    }],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Post", post_Schema);