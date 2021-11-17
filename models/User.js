const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    user_type: {
        type: String,
        required: true,
        default: 'user'
    },
    status: {
        type: String,
        required: true,
        default: 'active'
    },
    created_at: {
        type: Date,
        required: true,
        default: new Date()
    },
    updated_at: {
        type: Date,
        required: true,
        default: new Date()
    },
    verified: {
        type: Boolean,
        required: true,
        default: false
    },
    addresses: {
        type: Array
    }
},
{ timestamps: true }
);

userSchema.methods.generateAuthToken = function () {
    var tokens = {};

    tokens.accessToken = jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    tokens.refreshToken = jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY, { expiresIn: '6h' });
    return tokens;
};

const User = mongoose.model("user", userSchema);

module.exports = User;
