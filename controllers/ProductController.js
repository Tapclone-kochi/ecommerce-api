const Product = require('../models/Product')
const s3Helpers = require('../helpers/s3')

class ProductController {
    addProduct = async (req, res) => {
        let files = []
        req.files.forEach(file => {
        const obj={
            location:file.Location
        }
            files.push(obj)
        });
        const data = {
            name: req.body.name,
            price: req.body.price, 
            description: req.body.description,
            category_id: req.body.category_id,
            images: files,
            stockLeft: req.body.stockLeft
        }
        try {
            const product = new Product(data)
            await product.save()
            res.send({ error: false, msg: "Product Created" })
        } catch (error) {
            res.send({ error: true, msg: error.message })
        }
    }

    getProductsByCategoryID = async (req, res) => {
        try {
            const products = await Product.find({ category_id: req.params.id, disabled: false }).select('-__v').populate('category_id')
            res.send({ error: false, items: products })
        } catch (error) {
            res.send({ error: true, msg: error.message })
        }
    }

    deleteProduct = async (req, res) => {
        try {
            await Product.deleteOne({ _id: req.params.id })
            res.send({ error: false, msg: "Product Deleted" })
        } catch (error) {
            res.send({ error: true, msg: error.message })
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
            res.send({ error: true, msg: error.message })
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
            res.send({ error: true, msg: error.message })
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
            res.send({ error: true, msg: error.message })
        }
    }

    getProduct = async (req, res) => {
        try {
            const product = await Product.findOne({ _id: req.params.id }).select('-__v').populate('category_id')
            if (!product) {
                res.status(404).send({ error: true, msg: "Product not Found" })
                return
            }

            res.send({ error: false, product: product })
        } catch (error) {
            res.send({ error: true, msg: error.message })
        }
    }

    getProducts = async (req, res) => {
        try {
            const products = await Product.find({ disabled: false }).select('-__v').populate('category_id')
            res.send({ error: false, items: products })
        } catch (error) {
            res.send({ error: true, msg: error.message })
        }
    }

    deleteProductImage = async (req, res) => {
        try {
            let result = await s3Helpers.deleteS3Object(req.params.key)
            console.log(result);
            if (result)
                res.send({ error: false, msg: 'Deleted Successfully' })
            else
                res.send({ error: true, msg: 'An error Occured' })
        } catch (error) {
            res.send({ error: true, msg: error.message })
        }
    }

    searchProducts = async (req, res) => {
        try {
            const {
                searchTerm
            } = req.query
            const products = await Product.find({ name: new RegExp(searchTerm, "i") }).select('-__v').populate('category_id')
            res.send({ error: false, items: products })
        } catch (error) {
            res.send({ error: true, msg: error.message })
        }
    }

    editProductImage = async (req, res) => {
        try {
            s3Helpers.deleteS3Object(req.body.key)

            let products = await Product.findById(req.body.id)
            products.images[req.body.index] = req.file
            await products.save()

            res.send({ error: false, msg: "Image Updated Successfully" })
        } catch (error) {
            res.send({ error: true, msg: error.message })
        }
    }

    toggleStatus = async (req, res) => {
        try {
            let product = await Product.findById(req.body.id)
            if(!product) {
                res.send({ error: true, msg: "Product not found" })
                return
            }
            product.disabled = !product.disabled
            product.save()
            res.send({ error: false, msg: "Status Updated" })
        } catch (error) {
            res.send({ error: true, msg: error.message })
        }
    }

    getProductsByCategoryIDForAdmin = async (req, res) => {
        try {
            const products = await Product.find({ category_id: req.params.id }).select('-__v').populate('category_id')
            res.send({ error: false, items: products })
        } catch (error) {
            res.send({ error: true, msg: error.message })
        }
    }

    getProductsForAdmin = async (req, res) => {
        try {
            const products = await Product.find().select('-__v').populate('category_id')
            res.send({ error: false, items: products })
        } catch (error) {
            res.send({ error: true, msg: error.message })
        }
    }

}

module.exports = ProductController