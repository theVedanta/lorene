const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const unAuthUserSchema = new Schema(
  {
    mail: {
      type: String,
      required: true,
      unique: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expired: { type: Boolean, required: true },
  },
  { timestamps: true }
);

const model = mongoose.model("forgotOtp", unAuthUserSchema);

module.exports = model;
