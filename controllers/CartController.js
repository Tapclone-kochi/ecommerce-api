const Cart = require('../models/Cart')
const Product = require('../models/Product')

const mongoose = require("mongoose");

class CartController {
  addItemInCart = async (req, res) => {
    let searchQuery = {}
    if(req.user) {
      searchQuery = {
        userID: req.user._id
      }
    } else if(req.body.cartID) {
      searchQuery = {
        _id: req.body.cartID
      }
    }

    try {
      let cart = await Cart.findOne(searchQuery)
      let product = await Product.findById(req.body.productID)

      if(product.stockLeft < 1) {
        res.send({ error: true, msg: "Out of Stock!!" })
        return
      }

      if(product.stockLeft < req.body.quantity) {
        res.send({ error: true, msg: "Required Stock is unavailable" })
        return
      }

      if(!cart) {
        let products = []

        products.push(req.body)
        cart = new Cart({ userID: req.user?req.user._id:null, products: products })
        await cart.save()

        res.send({ error: false, msg: "Successfully added to cart", cartID: cart._id })
        return
      } else { 
        let product = cart.products.find(item => item.productID.equals(mongoose.Types.ObjectId(req.body.productID)))

        if(product) {
          res.send({ error: true, msg: "Product Already in Cart" })
          return
        }

        cart.products.push(req.body)
        cart.markModified('products')
        await cart.save()
        
        res.send({ error: false, msg: "Successfully added to cart", cartID: cart._id })
      }
    } catch (error) {
      console.error(error);
      res.send({ error: true, msg: "An Error Occured" })
    }
  }

  deleteItemInCart = async (req, res) => {
    let query = {}
    if(req.user) {
      query = {
        userID: req.user._id
      }
    } else {
      query = {
        _id: req.body.cartID
      }
    }
    try {
      let cart = await Cart.findOne(query)
      await cart.products.pull({ _id: req.params.id })
      await cart.save()

      res.send({ error: false, msg: "Successfully deleted from cart" })
    } catch (error) {
      res.send({ error: true, msg: "An Error Occured" })
    }
  }

  getCart = async (req, res) => {
    let query = {}
    if(req.user) {
      query = {
        userID: req.user._id
      }
    } else if(req.query.cartID) {
      query = {
        _id: req.query.cartID
      }
    } else {
      res.send({ error: true, msg: "An Error Occured" })
      return
    }
    try {
      let cart = await Cart.findOne(query).populate({
        path: 'products',
        populate: {
          path: 'productID'
        }
      })
      res.send({ error: false, cart: cart })
    } catch (error) {
      console.error(error);
      res.send({ error: true, msg: "An Error Occured" })
    }
  }

  clearCart = async (req, res) => {
    let query = {}
    if(req.user) {
      query = {
        userID: req.user._id
      }
    } else if(req.query.cartID) {
      query = {
        _id: req.query.cartID
      }
    } else {
      res.send({ error: true, msg: "An Error Occured" })
      return
    }
    try {
      let cart = await Cart.findOne(query)
      cart.products = []
      cart.markModified('products')
      await cart.save()
      res.send({ error: false, msg: "Successfully cleared the cart" })
    } catch (error) {
      res.send({ error: true, msg: "An Error Occured" })
    }
  }

  updateCartProductQuantity = async (req, res) => {
    try {
      let newQuantity = req.body.data

      let cart = await Cart.findOne({ userID: req.user._id })

      cart.products.forEach((el, index) => {
        cart.products[index].quantity = newQuantity[index]
      });
      cart.markModified('products')
      await cart.save()
      res.send({ error: false, msg: "Successfully updated the cart" })
    } catch (error) {
      res.send({ error: true, msg: "An Error Occured" })
    }
  }

  getCartTotalAmount = async (req, res) => {
    try {
      let cart = await Cart.findOne({ userID: req.user._id }).populate({
        path: 'products',
        populate: {
          path: 'productID'
        }
      })
      let products = cart.products
      let totalAmount = 0
      products.forEach(el => {
        totalAmount += el.productID.price * el.quantity
      });
      res.send({ error: false, totalAmount: totalAmount })
    } catch (error) {
      res.send({ error: true, msg: "An Error Occured" })
    }
  }
}

module.exports = CartController;