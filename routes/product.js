const router = require('express').Router();

const auth = require('../middleware/auth')

const ProductController = require('../controllers/ProductController');

const {
    addProduct,
    deleteProduct,
    updateProduct,
    getProductsByCategoryID,
    disableProduct,
    updateProductStocks,
    getProduct,
    getProducts
} = new ProductController();

router.post('/add', auth, addProduct)
router.delete('/delete/:id', auth, deleteProduct)
router.patch('/edit/:id', auth, updateProduct)
router.get('/list/:id', getProductsByCategoryID)
router.patch('/changeStatus/:id/:action', auth, disableProduct)
router.patch('/updateStock/:id', auth, updateProductStocks)
router.get('/view/:id', getProduct)
router.get('/list', auth, getProducts)

module.exports = router;