const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MsgSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mail: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    phone: { type: Number, required: true },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const model = mongoose.model("message", MsgSchema);

module.exports = model;
