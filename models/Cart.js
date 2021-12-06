const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  productID: {
    type: Schema.Types.ObjectId,
    ref: 'products',
    required: true,
    unique: true
  },
  quantity: {
    type: Number,
    required: true
  }
})

const cartSchema = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
    unique: true
  },
  products: [productSchema]
},
{ timestamps: true}
);

const Cart = mongoose.model("carts", cartSchema);

module.exports = Cart;