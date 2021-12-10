const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shippingSchema = new Schema({
  display_name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
  },
  short_name: {
    type: String,
    required: true
  }
});

const Shipping = mongoose.model("shipping_data", shippingSchema)
module.exports = Shipping;