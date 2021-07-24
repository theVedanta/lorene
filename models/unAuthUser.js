const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const unAuthUserSchema = new Schema(
  {
    mail: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
      unique: true,
    },
    state: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expired: { type: Boolean, required: true },
  },
  { timestamps: true }
);

const model = mongoose.model("unAuthUser", unAuthUserSchema);

module.exports = model;
