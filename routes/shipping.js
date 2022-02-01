const router = require('express').Router();

const ShippingController = require('../controllers/ShippingController')

const {
  getShippingInfo
} = new ShippingController()

router.get('/list', getShippingInfo)

module.exports = router;