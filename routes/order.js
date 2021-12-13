const router = require('express').Router();

const auth = require('../middleware/auth')

const OrderController = require('../controllers/OrderController')

const {
  createOrder,
  confirmOrder,
  getOrders,
  getOrder,
  getOrdersForAdmin,
  dispatchOrder
} = new OrderController()

router.post('/create', auth, createOrder);
router.post('/confirm', confirmOrder);
router.get('/list', auth, getOrders);
router.get('/detail/:id', auth, getOrder);
router.get('/list-for-admin', auth, getOrdersForAdmin)
router.patch('/dispatch', auth, dispatchOrder)

module.exports = router;