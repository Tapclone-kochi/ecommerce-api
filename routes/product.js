const router = require('express').Router();

const auth = require('../middleware/auth')

require('dotenv').config()

const ProductController = require('../controllers/ProductController');

const multer  = require('multer');
const multerS3 = require('multer-s3');
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
    bucket: process.env.AWS_BUCKET_NAME,
    metadata: (req, file, cb) => {
      cb(null, {fieldName: file.fieldname})
    },
    key: (req, file, cb) => {
      cb(null, Date.now().toString() + '-' + file.originalname)
    }
  }),
  limits: { fileSize: 5000000 },
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
    editProductImage
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
module.exports = router;