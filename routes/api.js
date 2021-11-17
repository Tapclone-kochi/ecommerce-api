const router = require('express').Router();

const authRoute = require('./auth');
const userRoute = require('./user');
const categoryRoute = require('./category');
const subCategoryRoute = require('./sub_category')

router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/category', categoryRoute);
router.use('/sub_category', subCategoryRoute);

module.exports = router;