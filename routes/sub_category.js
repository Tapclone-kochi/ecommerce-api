const router = require('express').Router();

const auth = require('../middleware/auth')

const SubCategoryController = require('../controllers/SubCategoryController')

const {
    addSubCategory,
    getSubCategories,
    deleteSubCategory,
    updateSubCategory
} = new SubCategoryController()

router.post('/add', auth, addSubCategory);
router.get('/list/:id', getSubCategories);
router.delete('/delete/:id', auth, deleteSubCategory);
router.patch('/edit/:id', auth, updateSubCategory);

module.exports = router;