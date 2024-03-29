const router = require('express').Router();

const auth = require('../middleware/auth')

const CategoryController = require('../controllers/CategoryController')

const {
    addCategory,
    getCategories,
    deleteCategory,
    updateCategory,
    getCategory
} = new CategoryController()

router.post('/add', auth, addCategory);
router.get('/list', getCategories);
router.delete('/delete/:id', auth, deleteCategory);
router.patch('/edit/:id', auth, updateCategory);
router.get('/details/:id', getCategory)

module.exports = router;