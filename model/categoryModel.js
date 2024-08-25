const mongoose = require("mongoose");
const User = require("./userModel");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name Is Required"],
        unique: [true, "Category Name is Already Exists"]
    },
    description: {
        type: String,
        required: false,
    },


});



const Category = mongoose.model('categories', categorySchema);

module.exports = Category;
