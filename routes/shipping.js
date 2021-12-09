const router = require('express').Router();

const auth = require('../middleware/auth')

const ShippingController = require('../controllers/ShippingController')

const {
  getShippingInfo
} = new ShippingController()

router.get('/list', auth, getShippingInfo)

module.exports = router;