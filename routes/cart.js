const router = require('express').Router();

const auth = require('../middleware/auth')
const guestAuth = require('../middleware/guest-auth')

const CartController = require('../controllers/CartController')

const {
  addItemInCart,
  deleteItemInCart,
  getCart,
  clearCart,
  updateCartProductQuantity,
  getCartTotalAmount,
  assignUserToCart,
} = new CartController()

router.post('/add', guestAuth, addItemInCart);
router.delete('/remove/:id', guestAuth, deleteItemInCart)
router.get('/get', guestAuth, getCart)
router.delete('/clear', guestAuth, clearCart)
router.post('/update-quantity', guestAuth, updateCartProductQuantity)
router.get('/get-amount', guestAuth, getCartTotalAmount)
router.post('/assign-to-cart', auth, assignUserToCart)

module.exports = router;