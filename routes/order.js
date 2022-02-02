const router = require('express').Router();

const auth = require('../middleware/auth')
const guestAuth = require('../middleware/guest-auth')

const OrderController = require('../controllers/OrderController')

const {
  createOrder,
  confirmOrder,
  getOrders,
  getOrder,
  getOrdersForAdmin,
  dispatchOrder
} = new OrderController()

router.post('/create', guestAuth, createOrder);
router.post('/confirm', confirmOrder);
router.get('/list', auth, getOrders);
router.get('/detail/:id', auth, getOrder);
router.get('/list-for-admin', auth, getOrdersForAdmin)
router.patch('/dispatch', auth, dispatchOrder)

module.exports = router;