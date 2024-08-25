const { default: mongoose } = require("mongoose");
const Blog = require("../model/blogModel");
const Category = require("../model/categoryModel");
const fs = require("fs");
let blogPostController = async (req, res) => {
    try {
        let { title, description, postedBy, category, tags } = req.body;
        let tagArray = tags.split(",");

        if (tagArray.length > 5) {
            res.send({
                message: "Maximum 5 tags allowed",
                "data": null
            });

        } else {

            let imageFilename = req.file ? req.file.path : 'uploads/default.jpg';
            let blog = new Blog({
                title,
                description,
                image: imageFilename,
                tags: tagArray,
                postedBy,
                category
            })
            await blog.save()

            return res.send({
                "message": "Blog post saved successfully",
                "data": blog
            })
        }


    } catch (error) {
        let errorMessage = "Error saving category";
        if (error.name === 'ValidationError') {
            const firstErrorKey = Object.keys(error.errors)[0];
            errorMessage = error.errors[firstErrorKey].message;
        }

        res.status(500).send({
            message: errorMessage,
            "data": null
        });

    }
}

const updateAPost = async (req, res) => {
    // console.log();
    try {
        const { id } = req.params;
        const { title, description, postedBy, category, tags } = req.body;

        let blog = await Blog.findOne({ _id: id });

        if (!blog) {
            return res.send({
                "message": "Blog Not Found",
                "data": null
            })
        }

        let tagArray = tags.split(",");

        if (tagArray.length > 5) {
            res.send({
                message: "Maximum 5 tags allowed",
                "data": null
            });

        } else {
            blog.title = title || blog.title;
            blog.description = description || blog.description;
            if (req.file) {
                blog.image = req.file.path
            }
            blog.tags = tagArray || blog.tags;
            blog.postedBy = postedBy || blog.postedBy;
            blog.category = category || blog.category;

            await blog.save()

            return res.send({
                "message": "Blog Updated successfully",
                "data": blog
            })
        }
    } catch (error) {
        let errorMessage = "Error saving Blog";
        if (error.name === 'ValidationError') {
            const firstErrorKey = Object.keys(error.errors)[0];
            errorMessage = error.errors[firstErrorKey].message;
        }

        res.status(500).send({
            message: errorMessage,
            "data": null
        });

    }
}
const deletePost = async (req, res) => {
    // console.log();
    try {
        const { id } = req.params;
        let blog = await Blog.findOne({ _id: id });

        if (!blog) {
            return res.send({
                "message": "Blog Not Found",
                "data": null
            })
        }
        const imageFilename = blog.image;
        await Blog.deleteOne({ _id: id })

        if (imageFilename) {
            const imagePath = `uploads/${imageFilename}`
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath)
            }
        }


        return res.send({
            "message": "Blog Deleted successfully",
            "data": { _id: id }
        })
    } catch (error) {
        let errorMessage = "Error Deleted Blog";
        if (error.name === 'ValidationError') {
            const firstErrorKey = Object.keys(error.errors)[0];
            errorMessage = error.errors[firstErrorKey].message;
        }

        res.status(500).send({
            message: errorMessage,
            "data": null
        });

    }
}
let categoryWithPosts = async (req, res) => {
    try {
        const result = await Blog.aggregate([
            {
                $lookup: {
                    from: 'categories', // The name of the categories collection
                    localField: 'category',
                    foreignField: '_id',
                    as: 'categoryDetails'
                }
            },
            {
                $unwind: '$categoryDetails'
            },
            {
                $group: {
                    _id: '$categoryDetails._id',
                    category: { $first: '$categoryDetails' },
                    posts: { $push: '$$ROOT' }
                }
            },
            {
                $project: {
                    'category.__v': 0,
                    'posts.__v': 0,
                    'posts.categoryDetails': 0
                }
            }
        ]);

        res.send(result)
    } catch (err) {
        console.error(err);
    }
}
let authorWithPost = async (req, res) => {
    try {
        const result = await Blog.aggregate([
            {
                $lookup: {
                    from: 'users', // The name of the categories collection
                    localField: 'postedBy',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $unwind: '$userDetails'
            },
            {
                $group: {
                    _id: '$userDetails._id',
                    postedBy: { $first: '$userDetails' },
                    posts: { $push: '$$ROOT' }
                }
            },
            {
                $project: {
                    'postedBy.__v': 0,
                    'posts.__v': 0,
                    'posts.userDetails': 0
                }
            }
        ]);

        res.send(result)
    } catch (err) {
        console.error(err);
    }
}

let postByCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById({ _id: id })
        if (!category) {
            res.send("Category Not Found");
        }
        let categoryPost = await Blog.aggregate([
            {
                $match: {
                    category: mongoose.Types.ObjectId(category._id)
                }
            },

        ])
        res.send(categoryPost)
    } catch (error) {
        res.send(error)
    }
}


module.exports = { blogPostController, updateAPost, categoryWithPosts, authorWithPost, postByCategory, deletePost };