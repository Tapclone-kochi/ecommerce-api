const router = require('express').Router();

const authRoute = require('./auth');
const userRoute = require('./user');
const categoryRoute = require('./category');
const subCategoryRoute = require('./sub_category');
const productRoute = require('./product');
const cartRoute = require('./cart')

router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/category', categoryRoute);
router.use('/sub_category', subCategoryRoute);
router.use('/product', productRoute);
router.use('/cart', cartRoute);

module.exports = router;