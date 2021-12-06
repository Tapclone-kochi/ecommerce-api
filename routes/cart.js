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

router.post('/add', auth, addItemInCart);
router.delete('/remove/:id', auth, deleteItemInCart)
router.get('/get', auth, getCart)
router.delete('/clear', auth, clearCart)
router.post('/update-quantity', auth, updateCartProductQuantity)
router.get('/get-amount', auth, getCartTotalAmount)

module.exports = router;