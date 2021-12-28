const router = require('express').Router();

const auth = require('../middleware/auth')

const CartController = require('../controllers/CartController')

const {
  addItemInCart,
  deleteItemInCart,
  getCart,
  clearCart,
  updateCartProductQuantity,
  getCartTotalAmount
} = new CartController()

router.post('/add', addItemInCart);
router.delete('/remove/:id', deleteItemInCart)
router.get('/get', getCart)
router.delete('/clear', clearCart)
router.post('/update-quantity', updateCartProductQuantity)
router.get('/get-amount', getCartTotalAmount)

module.exports = router;