const router = require('express').Router();

const auth = require('../middleware/auth')

require('dotenv').config()

const ProductController = require('../controllers/ProductController');

const multer  = require('multer');
const multerS3 = require('multer-sharp-s3');
const AWS = require('aws-sdk');
 
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const uploadS3 = multer({
  storage: multerS3({
    s3: s3,
    acl: 'public-read',
    Bucket: process.env.AWS_BUCKET_NAME,
    cacheControl: 'max-age=604800',
    metadata: (req, file, cb) => {
      cb(null, {fieldName: file.fieldname})
    },
    key: (req, file, cb) => {
      cb(null, Date.now().toString() + '-' + file.originalname)
    },
    resize: {
      width: 260,
      height: 340,
    },
  }),
  fileFilter: fileFilter
});

const {
    addProduct,
    deleteProduct,
    updateProduct,
    getProductsByCategoryID,
    disableProduct,
    updateProductStocks,
    getProduct,
    getProducts,
    deleteProductImage,
    searchProducts,
    editProductImage,
    toggleStatus,
    getProductsByCategoryIDForAdmin,
    getProductsForAdmin
} = new ProductController();

router.post('/add', auth, uploadS3.array("images", 5), addProduct)
router.delete('/delete/:id', auth, deleteProduct)
router.patch('/edit/:id', auth, updateProduct)
router.get('/list/:id', getProductsByCategoryID)
router.patch('/changeStatus/:id/:action', auth, disableProduct)
router.patch('/updateStock/:id', auth, updateProductStocks)
router.get('/view/:id', getProduct)
router.get('/list', auth, getProducts)
router.delete('/delete-image/:key', auth, deleteProductImage)
router.get('/search', searchProducts)
router.patch('/editImage', auth, uploadS3.single("image", 1), editProductImage)
router.patch('/toggle-status', auth, toggleStatus)
router.get('/list-for-admin/:id', getProductsByCategoryIDForAdmin)
router.get('/list-for-admin', auth, getProductsForAdmin)

module.exports = router;