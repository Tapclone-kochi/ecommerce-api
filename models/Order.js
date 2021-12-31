const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  productID: {
    type: Schema.Types.ObjectId,
    ref: 'products',
    required: true,
  },
  quantity: {
    type: Number,
    required: true
  }
})

const orderSchema = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  orderID: {
    type: String,
    required: true,
    unique: true,
  },
  paymentMethod: {
    type: String,
    required: true
  },
  delivery_partner_name: {
    type: String,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  items: [productSchema],
  status: {
    type: String,
    default: 'payment_pending',
    required: true
  },
  trackingNo: {
    type: String
  },
  user_details: {
    name: {
      type: String,
      required: true
    },
    mobile: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pin: {
      type: String,
      required: true
    }
  },
  order_unique: {
    type: String, 
    required: true
  },
  paid_at: {
    type: Date
  }
},
{ timestamps: true }
)

const Order = mongoose.model("orders", orderSchema)
module.exports = Order;