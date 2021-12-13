const Order = require('../models/Order')
const Cart = require('../models/Cart')
const Shipping = require('../models/Shipping')
const Product = require('../models/Product')

const Razorpay = require('razorpay');

class OrderController {
  createOrder = async (req, res) => {
    try {
      let cart = await Cart.findOne({ userID: req.user._id }).populate({ // Get cart
        path: 'products',
        populate: {
          path: 'productID'
        }
      })

      if(! cart) {
        res.send({ error: true, msg: "No Products in cart!!" })
        return
      }
      let shippingData = await Shipping.findOne({ short_name: req.body.shippingMethod }) // Get shipping data
      if(!shippingData) {
        res.send({ error: true, msg: "Shipping Data missing" })
        return
      }

      let grandTotal = 0

      cart.products.forEach(el => {
        grandTotal += el.productID.price // Calculate subtotal
      });

      grandTotal += shippingData.price // Add shipping charge
      grandTotal = (grandTotal * 100).toFixed() // Converting to paisa

      let products = cart.products

      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });

      let razorpayOrder;
      razorpayOrder = await razorpay.orders.create({ // Create order
        currency: 'INR',
        amount: grandTotal,
        receipt: 'Receipt #' + req.user._id,
      });

      let newOrder = new Order({
        paymentMethod: req.body.paymentMethod,
        shippingMethod: req.body.shippingMethod,
        totalAmount: grandTotal,
        items: products,
        userID: req.user._id,
        orderID: razorpayOrder.id
      })

      await newOrder.save()
      await Cart.deleteOne({ userID: req.user._id }) // Delete cart
      res.send({ error: false, msg: "Successfully placed the order", data: {
          order_id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
        } 
      })
    } catch (error) {
      console.error(error);
      res.send({ error: true, msg: "An Error Occured" })
    }
  }

  confirmOrder = async (req, res) => {
    try {
      const signature = req.get('x-razorpay-signature');
      if (!signature) res.send({ error: true, msg: "Payment Error" })

      const isRequestValid = Razorpay.validateWebhookSignature(
        JSON.stringify(req.body),
        signature,
        process.env.WEBHOOK_SECRET
      );
      if(!isRequestValid) {
        throw "Request not Valid"
      }
      const { order_id } = req.body.payload.payment.entity;
      let order = await Order.findOne({ orderID: order_id })
      order.status = "order_placed"
      order.markModified('status')

      await order.save()

      for (let index = 0; index < order.items.length; index++) {
        const el = order.items[index];
        let product = await Product.findById(el.productID)
        product.stockLeft = product.stockLeft - el.quantity
        await product.save()
      }

      res.send({ error: false, msg: "Payment Verified" })
    } catch (error) {
      console.error(error);
      res.send({ error: true, msg: "An Error Occured" })
    }
  }

  getOrders = async (req, res) => {
    try {
      const orders = await Order.find({ userID: req.user._id })
      res.send({ error: false, orders: orders })
    } catch (error) {
      console.error(error);
      res.send({ error: true, msg: "An Error Occured" })
    }
  }

  getOrder = async (req, res) => {
    try {
      const order = await Order.findById(req.params.id).populate({
        path: 'items',
        populate: {
          path: 'productID'
        }
      })
      .populate('userID')
      if(! order) {
        res.send({ error: true, msg: "Order Not Found" })
        return
      }
      res.send({ error: false, order: order })
    } catch (error) {
      res.send({ error: true, msg: "An Error Occured" })
    }
  }

  getOrdersForAdmin = async (req, res) => {
    try {
      const orders = await Order.find().populate('userID', 'name mobile pin')
      res.send({ error: false, orders: orders })
    } catch (error) {
      console.error(error);
      res.send({ error: true, msg: "An Error Occured" })
    }
  }

  dispatchOrder = async (req, res) => {
    try {
      let order = await Order.findById(req.body.id)
      order.status = 'order_dispatched'
      order.trackingNo = req.body.trackingNo
      order.markModified('status')
      order.markModified('trackingNo')
      await order.save()
      res.send({ error: false, msg: "Order Status changed to dispatched"})
    } catch (error) {
      console.error(error);
      res.send({ error: true, msg: "An Error Occured" })
    }
  }
}

module.exports = OrderController;