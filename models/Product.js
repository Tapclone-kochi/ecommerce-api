const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    stockLeft: {
        type: Number,
        default: 0
    },
    images: {
        type: Array
    },
    disabled: {
        type: Boolean,
        required: true,
        default: false
    },
    category_id: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        required: true
    }
},
{ timestamps: true }
);

const Product = mongoose.model("products", productSchema);

module.exports = Product;