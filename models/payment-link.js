const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentLinkSchema = new Schema(
  {
    user: String,
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    paymentModes: {
      type: Array,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    multiple: {
      type: Boolean,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    customer: Object,
    receipt: String,
    returnUrl: String,
  },
  { timestamps: true }
);

const model = mongoose.model("payment-link", PaymentLinkSchema);

module.exports = model;
