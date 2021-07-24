const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  user: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  businessName: {
    type: String,
    required: true,
  },
  name: String,
  company: String,
  mail: String,
  phone: Number,
  website: String,
  billingAddress: Object,
  shippingAddress: Object,
  addressDiff: Boolean,
});

const model = mongoose.model("customer", CustomerSchema);

module.exports = model;
