const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PageSchema = new Schema(
  {
    user: String,
    name: {
      type: String,
      required: true,
    },
    images: { type: Array, required: true },
    video: String,
    description: String,
    terms: String,
    contact: Object,
    social: Boolean,
    price: { type: Number, required: true },
    priceType: { type: String, required: true },
    discount: Number,
    tax: Number,
    total: Number,
    taxObj: Object,
    active: Boolean,
    url: String,
  },
  { timestamps: true }
);

const model = mongoose.model("page", PageSchema);

module.exports = model;
