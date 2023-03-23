const router = require('express').Router();

const auth = require('../middleware/auth')

const AuthController = require('../controllers/AuthController')

const {
    register,
    login,
    profile,
    loginWithMobile,
    adminLogin,
    forgotPassword,
    checkResetPasswordLinkValid,
    resetPassword
} = new AuthController()

router.post('/register', register)
router.post('/login', login)
router.post('/loginWithMobile', loginWithMobile)
router.get('/profile', auth, profile)
router.post('/admin-login',adminLogin)
router.post('/forgot-password/:mobile', forgotPassword)
router.post('/check-reset-link', checkResetPasswordLinkValid)
router.post('/reset-password', resetPassword)

module.exports = router;