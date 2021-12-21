const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shippingSchema = new Schema({
  price: {
    type: Number,
    required: true,
  },
  state_name: {
    type: String,
    required: true
  },
  delivery_partner_name:{
    type: String,
    required: true
  }
});

const Shipping = mongoose.model("shipping_data", shippingSchema)
module.exports = Shipping;