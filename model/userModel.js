const mongoose = require("mongoose");

const userModel = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Email is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    emailVerify: {
        type: Boolean,
        default: false
    }
});

const User = mongoose.model('users', userModel);

module.exports = User;