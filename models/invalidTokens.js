const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itSchema = new Schema(
  {
    token: { type: String, required: true, unique: true },
    toDelete: { type: Boolean, required: true },
  },
  { timestamps: true }
);

const model = mongoose.model("invalid-token", itSchema);

module.exports = model;
