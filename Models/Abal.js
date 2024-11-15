const mongoose = require("mongoose");

// Define the schema
const AbalSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,

    unique: true,
    match: /.+\@.+\..+/,
  },
  phone: {
    type: String,

    match: /^\d{10}$/,
  },
  gbigubae: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gbigubae",
    required: true,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  Date: {
    type: Date,
    default: Date.now,
  },
});

const Abal = mongoose.model("Abal", AbalSchema);

module.exports = Abal;
