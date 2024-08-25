const mongoose = require("mongoose");
const User = require("./userModel");
const Category = require("./categoryModel");

const blogModel = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Email is required"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
    },
    image: {
        type: String,
        required: false
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Category, // reference to Category model
        required: [true, "Category is required"]
    },
    tags: [String],
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,  // reference to User model
    }
});

const Blog = mongoose.model('blogs', blogModel);

module.exports = Blog;