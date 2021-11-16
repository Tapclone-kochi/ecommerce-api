const router = require('express').Router();

const auth = require('../middleware/auth')

const AuthController = require('../controllers/AuthController')

const {
    register,
    login,
    profile
} = new AuthController()

router.post('/register', register)
router.post('/login', login)
router.get('/profile', auth, profile)

module.exports = router;