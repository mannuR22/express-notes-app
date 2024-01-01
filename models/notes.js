const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    _id: String,
    userId: String,
    title: String,
    content: String,
    createdAt: {
        type: Number,
        default: Date.now(),
    },
    lastUpdatedAt: {
        type: Number,
    }
});

module.exports = mongoose.model("Notes", userSchema, "Notes");
