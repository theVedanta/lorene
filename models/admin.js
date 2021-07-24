const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdminSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: String,
  },
  { timestamps: true }
);

const model = mongoose.model("admin", AdminSchema);

module.exports = model;
