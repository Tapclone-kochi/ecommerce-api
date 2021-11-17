const SubCategory = require('../models/SubCategory')

class SubCategoryController {
    addSubCategory = async (req, res) => {
        try {
            const category = new SubCategory(req.body)
            await category.save()
            res.send({ error: false, msg: "Sub Category Created!!" });
        } catch (error) {
            console.log(error);
            res.send({ error: true, msg: error.message })
        }
    }

    getSubCategories = async (req, res) => {
        try {
            const categories = await SubCategory.find({ category_id: req.params.id}).select('-__v')
            res.send({ error: false, items: categories })
        } catch (error) {
            res.send({ error: true, msg: "An Error Occured" })
        }
    }

    deleteSubCategory = async (req, res) => {
        try {
            await SubCategory.deleteOne({ _id: req.params.id })
            res.send({ error: false, msg: "Sub Category Deleted!!" })
        } catch (error) {
            res.send({ error: true, msg: "An Error Occured" })
        }
    }

    updateSubCategory = async (req, res) => {
        try {
            const category = await SubCategory.findOneAndUpdate({ _id: req.params.id }, req.body)
            if(!category) {
                res.status(404).send({ error: true, msg: "Sub Category not Found" })
                return
            }
            res.send({ error: false, msg: "Sub Category Updated" })
        } catch (error) {
            res.send({ error: true, msg: "An Error Occured" })
        }
    }
}

module.exports = SubCategoryController;