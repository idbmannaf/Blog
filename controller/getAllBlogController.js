const Blog = require("../model/blogModel");

let getAllBlogController = async (req, res) => {

    let blogs = await Blog.find({}).populate(["postedBy", "category"]);

    return res.send(blogs)
}

module.exports = getAllBlogController;