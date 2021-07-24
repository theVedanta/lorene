const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaxSchema = new Schema({
  user: String,
  name: {
    type: String,
    required: true,
  },
  offer: {
    type: Number,
    required: true,
  },
  active: Boolean,
});

const model = mongoose.model("taxe", TaxSchema);

module.exports = model;
