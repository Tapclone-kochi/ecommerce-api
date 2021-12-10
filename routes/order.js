const router = require('express').Router();

const auth = require('../middleware/auth')

const OrderController = require('../controllers/OrderController')

const {
  createOrder,
  confirmOrder,
  getOrders,
  getOrder
} = new OrderController()

router.post('/create', auth, createOrder);
router.post('/confirm', confirmOrder);
router.get('/list', auth, getOrders);
router.get('/detail/:id', auth, getOrder);

module.exports = router;