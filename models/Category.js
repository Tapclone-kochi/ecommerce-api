const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    disabled: {
        type: Boolean,
        required: true,
        default: false
    },
    image_file: {
        type: Array
    },
    
},
{ timestamps: true }
)

const Category =  mongoose.model("category", categorySchema);

module.exports = Category