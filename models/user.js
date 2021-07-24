const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
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
    balance: Number,
    address: Object,
    bankInfo: Object,
    logo: String,
    verified: Boolean,
    pan: String,
    aadhaarFront: String,
    aadhaarBack: String,
    gst: String,
  },
  { timestamps: true }
);

const model = mongoose.model("user", UserSchema);

module.exports = model;
