const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resetPasswordSchema = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  resetCode: {
    type: String,
    required: true,
    expires: '24h'
  }
},
{ timestamps: true}
)

const ResetPassword = mongoose.model("reset_secrets", resetPasswordSchema)

module.exports = ResetPassword;