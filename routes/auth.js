const router = require('express').Router();

const auth = require('../middleware/auth')

const AuthController = require('../controllers/AuthController')

const {
    register,
    login,
    profile,
    loginWithMobile,
    adminLogin
} = new AuthController()

router.post('/register', register)
router.post('/login', login)
router.post('/loginWithMobile', loginWithMobile)
router.get('/profile', auth, profile)
router.post('/admin-login', adminLogin)

module.exports = router;