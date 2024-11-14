const mongoose = require("mongoose");

const StaffSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: String,
    required: true,
    match: /^\d{10}$/,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/,
  },
  jobType: {
    type: String,
    required: true,
  },
});

const Staff = mongoose.model("Staff", StaffSchema);

module.exports = Staff;
