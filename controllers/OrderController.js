const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Shipping = require("../models/Shipping");
const Product = require("../models/Product");
const User = require("../models/User");
const Razorpay = require("razorpay");
const ShortUniqueId = require('short-unique-id');
const sms = require('../helpers/sms')
const telegram = require('../helpers/telegram')
class OrderController {
  createOrder = async (req, res) => {
    try {
      let cart = await Cart.findOne({ userID: req.user._id }).populate({
        // Get cart
        path: "products",
        populate: {
          path: "productID",
        },
      });

      if (!cart) {
        res.send({ error: true, msg: "No Products in cart!!" });
        return;
      }

      const user = await User.findById(req.user._id).select("name mobile state pin address");
      let data = await Shipping.findOne({
        state_name: user.state,
        delivery_partner_name: req.body.delivery_partner_name,
      });
      let productCount = await Cart.findOne({ userID: req.user._id });

      let count = 0;
      let shippingPrice = 0;
      productCount.products.forEach(countFunction);
      function countFunction(item) {
        count = count + item.quantity;
      }
      if (count - 1 >= 1) {
        if (data.state_name === "Kerala") {
          data.price = data.price + (count - 1) * 30;
          shippingPrice = data.price;
        } else {
          data.price = data.price + (count - 1) * 50;
          shippingPrice = data.price;
        }
      } else {
        shippingPrice = data.price;
      }

      let grandTotal = 0;

      cart.products.forEach((el) => {
        grandTotal += el.productID.price; // Calculate subtotal
      });

      grandTotal += shippingPrice; // Add shipping charge
      grandTotal = (grandTotal * 100).toFixed(); // Converting to paisa

      let products = cart.products;

      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });

      let razorpayOrder;
      razorpayOrder = await razorpay.orders.create({
        // Create order
        currency: "INR",
        amount: grandTotal,
        receipt: "Receipt #" + req.user._id,
      });

      const uid = new ShortUniqueId({ length: 6 })

      let newOrder = new Order({
        paymentMethod: req.body.paymentMethod,
        delivery_partner_name: req.body.delivery_partner_name,
        totalAmount: grandTotal,
        items: products,
        userID: req.user._id,
        orderID: razorpayOrder.id,
        user_details: {
          name: user.name,
          mobile: user.mobile,
          address: user.address,
          pin: user.pin,
          state: user.state
        },
        order_unique: uid()
      });

      await newOrder.save();
      await Cart.deleteOne({ userID: req.user._id }); // Delete cart
      res.send({
        error: false,
        msg: "Successfully placed the order",
        data: {
          order_id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
        },
      });
    } catch (error) {
      console.error(error);
      res.send({ error: true, msg: "An Error Occured during Payment" });
    }
  };

  confirmOrder = async (req, res) => {
    try {
      const signature = req.get("x-razorpay-signature");
      if (!signature) res.send({ error: true, msg: "Payment Error" });

      const isRequestValid = Razorpay.validateWebhookSignature(
        JSON.stringify(req.body),
        signature,
        process.env.WEBHOOK_SECRET
      );
      if (!isRequestValid) {
        throw "Request not Valid";
      }
      const { order_id } = req.body.payload.payment.entity;
      let order = await Order.findOne({ orderID: order_id });
      order.status = "order_placed";
      order.paid_at = new Date()
      order.markModified("status");
      order.markModified("paid_at");

      await order.save();

      for (let index = 0; index < order.items.length; index++) {
        const el = order.items[index];
        let product = await Product.findById(el.productID);
        product.stockLeft = product.stockLeft - el.quantity;
        await product.save();
      }

      telegram.sendOrderPlacedToAdmin(order.order_unique)
      
      res.send({ error: false, msg: "Payment Verified" });
    } catch (error) {
      console.error(error);
      res.send({ error: true, msg: "An Error Occured" });
    }
  };

  getOrders = async (req, res) => {
    try {
      const orders = await Order.find({ userID: req.user._id });
      res.send({ error: false, orders: orders });
    } catch (error) {
      console.error(error);
      res.send({ error: true, msg: "An Error Occured" });
    }
  };

  getOrder = async (req, res) => {
    try {
      const order = await Order.findById(req.params.id)
        .populate({
          path: "items",
          populate: {
            path: "productID",
          },
        })
      if (!order) {
        res.send({ error: true, msg: "Order Not Found" });
        return;
      }
      res.send({ error: false, order: order });
    } catch (error) {
      res.send({ error: true, msg: "An Error Occured" });
    }
  };

  getOrdersForAdmin = async (req, res) => {
    const {
      status,
      orderID,
      fromDate,
      toDate
    } = req.query

    const query = {
      ...(status !== undefined && status !== "" && { status }),
      ...(orderID !== undefined && orderID !== "" && { order_unique: orderID }),
      ...(fromDate !== undefined && fromDate !== "" && toDate !== undefined && toDate !== "" && { 
        $and: [
          { createdAt: { $gte: new Date(fromDate) } },
          { createdAt: { $lte: new Date(toDate) } }
        ]
       }),
    }
    try {
      const orders = await Order.find(query).sort({ createdAt: -1 });
      res.send({ error: false, orders: orders });
    } catch (error) {
      console.error(error);
      res.send({ error: true, msg: "An Error Occured" });
    }
  };

  dispatchOrder = async (req, res) => {
    try {
      let order = await Order.findById(req.body.id);
      if(!order) {
        res.send({ error: true, msg: "Order not found" });
        return
      }
      order.status = "order_dispatched";
      order.trackingNo = req.body.trackingNo;
      order.delivery_partner_name = req.body.delivery_partner_name
      order.markModified("status");
      order.markModified("trackingNo");
      order.markModified("delivery_partner_name")
      
      await order.save();

      let user = await User.findById(order.userID)
      sms.sendDispatchSMS(user.mobile, order.trackingNo, order.delivery_partner_name, order.order_unique)
      
      res.send({ error: false, msg: "Order Status changed to dispatched" });
    } catch (error) {
      console.error(error);
      res.send({ error: true, msg: "An Error Occured" });
    }
  };
}

module.exports = OrderController;
