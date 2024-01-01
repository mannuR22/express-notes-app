const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    _id: String,
    username: String,
    password: String,
    createdAt: {
        type: Number,
        default: Date.now(),
    },
});
module.exports = mongoose.model("Users", userSchema, "Users");
