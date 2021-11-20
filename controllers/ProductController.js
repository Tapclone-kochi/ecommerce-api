const Product = require('../models/Product')

class ProductController {
    addProduct = async (req, res) => {
        try {
            const product = new Product(req.body)
            await product.save()
            res.send({ error: false, msg: "Product Created" })
        } catch (error) {
            res.send({ error: false, msg: error.message })
        }
    }

    getProductsByCategoryID = async (req, res) => {
        try {
            const products = await Product.find({ category_id: req.params.id }).select('-__v').populate('category_id')
            res.send({ error: false, items: products })
        } catch (error) {
            res.send({ error: false, msg: error.message })
        }
    }

    deleteProduct = async (req, res) => {
        try {
            await Product.deleteOne({ _id: req.params.id })
            res.send({ error: false, msg: "Product Deleted" })
        } catch (error) {
            res.send({ error: false, msg: error.message })
        }
    }

    updateProduct = async (req, res) => {
        const updatedProduct = {
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
        }
        try {
            const product = await Product.findOneAndUpdate({ _id: req.params.id }, updatedProduct)
            if (!product) {
                res.status(404).send({ error: true, msg: "Product not Found" })
                return
            }
            res.send({ error: false, msg: "Product Updated" })
        } catch (error) {
            res.send({ error: false, msg: error.message })
        }
    }

    updateProductStocks = async (req, res) => {
        const updatedProduct = {
            stockLeft: req.body.stock
        }
        try {
            const product = await Product.findOneAndUpdate({ _id: req.params.id }, updatedProduct)
            if (!product) {
                res.status(404).send({ error: true, msg: "Product not Found" })
                return
            }
            res.send({ error: false, msg: "Product Stocks Updated" })
        } catch (error) {
            res.send({ error: false, msg: error.message })
        }
    }

    disableProduct = async (req, res) => {
        const updatedProduct = {
            disabled: req.params.action === 'disable' ? true : false
        }
        try {
            const product = await Product.findOneAndUpdate({ _id: req.params.id }, updatedProduct)
            if (!product) {
                res.status(404).send({ error: true, msg: "Product not Found" })
                return
            }
            res.send({ error: false, msg: "Product " + (req.params.action === 'disable' ? "Disabled" : "Enabled") })
        } catch (error) {
            res.send({ error: false, msg: error.message })
        }
    }

    getProduct = async (req, res) => {
        try {
            const product = await Product.findOne({ _id: req.params.id }).select('-__v')
            if (!product) {
                res.status(404).send({ error: true, msg: "Product not Found" })
                return
            }

            res.send({ error: false, product: product })
        } catch (error) {
            res.send({ error: false, msg: error.message })  
        }
    }

    getProducts = async (req, res) => {
        try {
            const products = await Product.find().select('-__v').populate('category_id')
            res.send({ error: false, items: products })
        } catch (error) {
            res.send({ error: false, msg: error.message })
        }
    }
}

module.exports = ProductController