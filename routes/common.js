const router = require('express').Router();

const auth = require('../middleware/auth')

const CommonController = require('../controllers/CommonController')

const {
  getDashboardData
} = new CommonController()

router.get('/getDashboardData', auth, getDashboardData);

module.exports = router;