const Category = require('../model/categoryModel')
const createCategory = async (req, res) => {
    const { name, description } = req.body;
    try {
        let category = new Category({
            name: name.toLowerCase(),
            description: description,
        })

        let save = await category.save();
        console.log(save);

        res.send({
            "message": "Category saved successfully",
            "data": category
        })
    } catch (error) {
        res.send({
            "message": error,
            "data": null
        })
    }

}

const getCategories = async (req, res) => {
    try {
        let category = await Category.find({})
        res.send({
            "message": "Category saved successfully",
            "data": category
        })
    } catch (error) {
        res.send({
            "message": error,
            "data": null
        })
    }

}


const deleteCategory = async (req, res) => {
    try {
        let category_id = req.params.id
        let category = await Category.deleteOne({ _id: category_id })
        res.send({
            "message": "Category Deleted successfully",
            "data": category
        })
    } catch (error) {
        res.send({
            "message": error,
            "data": null
        })
    }

}

const editCategory = async (req, res) => {
    try {
        let category_id = req.params.id
        const { name, description } = req.body
        let category = await Category.findOne({ _id: category_id })
        if (!category) {
            res.send({
                "message": "Category Not Found",
                "data": null
            })
        }
        category.name = name || category.name;
        category.description = description || category.description;
        await category.save()
        res.send({
            "message": "Category Updated successfully",
            "data": category
        })
    } catch (error) {
        res.send({
            "message": error,
            "data": null
        })
    }

}

module.exports = { createCategory, getCategories, deleteCategory, editCategory }
