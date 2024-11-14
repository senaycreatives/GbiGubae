const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
});

const Service = mongoose.model("Service", ServiceSchema);

module.exports = Service;
