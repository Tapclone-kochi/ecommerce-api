const router = require('express').Router();

const authRoute = require('./auth');
const userRoute = require('./user');
const categoryRoute = require('./category');
const subCategoryRoute = require('./sub_category');
const productRoute = require('./product');
const cartRoute = require('./cart')
const shippingRoute = require('./shipping')
const orderRoute = require('./order')

router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/category', categoryRoute);
router.use('/sub_category', subCategoryRoute);
router.use('/product', productRoute);
router.use('/cart', cartRoute);
router.use('/shipping', shippingRoute);
router.use('/order', orderRoute);

module.exports = router;