const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuotationSchema = new Schema(
  {
    invoiceNumber: String,
    invoiceID: String,
    user: String,
    name: { type: String, required: true },
    summary: { type: String, required: true },
    discount: Number,
    tax: Number,
    subTotal: { type: Number, required: true },
    total: { type: Number, required: true },
    taxObj: Object,
    date: { type: Date, required: true },
    customer: { type: String, required: true },
    custName: { type: String, required: true },
    items: { type: Array, required: true },
    gst: String,
  },
  { timestamps: true }
);

const model = mongoose.model("quotation", QuotationSchema);

module.exports = model;
