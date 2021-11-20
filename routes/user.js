const router = require('express').Router();

const auth = require('../middleware/auth')

const UserController = require('../controllers/UserContoller')

const {
    getUserList,
    updateUser,
    getUserProfile
} = new UserController()

router.get('/list', auth, getUserList)
router.patch('/edit/:id', auth, updateUser);
router.get('/profile/:id', auth, getUserProfile);

module.exports = router;