const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InvoiceSchema = new Schema(
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
    due: { type: Date, required: true },
    customer: { type: Object, required: true },
    items: { type: Array, required: true },
    paymodes: { type: Array, required: true },
    gst: String,
    status: { type: String, required: true },
    paymentDate: Date,
  },
  { timestamps: true }
);

const model = mongoose.model("invoice", InvoiceSchema);

module.exports = model;
