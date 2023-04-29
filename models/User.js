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
        unique: true,
        index: true,
        required:false,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
        index: true
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
    verified: {
        type: Boolean,
        required: true,
        default: false
    },
    address: {
        type: String,
    },
    pin: {
        type: String,
    },
    state: {
        type: String,
    }
},
{ timestamps: true }
);

userSchema.methods.generateAuthToken = function () {
    var tokens = {};

    tokens.accessToken = jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
    tokens.refreshToken = jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY, { expiresIn: '14d' });
    return tokens;
};

const User = mongoose.model("user", userSchema);

module.exports = User;
