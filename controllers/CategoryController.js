const Category = require('../models/Category')
const Product = require('../models/Product')

class CategoryController {
    addCategory = async (req, res) => {
        try {
            const category = new Category(req.body)
            await category.save()
            res.send({ error: false, msg: "Category Created!!" });
        } catch (error) {
            console.log(error);
            res.send({ error: true, msg: "An Error Occured" })
        }
    }

    getCategories = async (req, res) => {
        try {
            const categories = await Category.find()
            res.send({ error: false, items: categories })
        } catch (error) {
            res.send({ error: true, msg: "An Error Occured" })
        }
    }

    deleteCategory = async (req, res) => {
        try {
            await Category.deleteOne({ _id: req.params.id })
            await Product.deleteMany({ category_id: req.params.id})
            res.send({ error: false, msg: "Category Deleted!!" })
        } catch (error) {
            res.send({ error: true, msg: "An Error Occured" })
        }
    }

    updateCategory = async (req, res) => {
        try {
            const category = await Category.findOneAndUpdate({ _id: req.params.id }, req.body)
            if(!category) {
                res.status(404).send({ error: true, msg: "Category not Found" })
                return
            }
            res.send({ error: false, msg: "Category Updated" })
        } catch (error) {
            res.send({ error: true, msg: "An Error Occured" })
        }
    }

    getCategory = async (req, res) => {
        try {
            const category = await Category.findById(req.params.id)
            res.send({ error: false, category: category })
        } catch (error) {
            res.send({ error: true, msg: "An Error Occured" })
        }
    }
}

module.exports = CategoryController;