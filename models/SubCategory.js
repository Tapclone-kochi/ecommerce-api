const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subCategorySchema = new Schema({
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
    category_id: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        required: true
    }
},
{ timestamps: true }
)

const Category =  mongoose.model("sub_category", subCategorySchema);

module.exports = Category