const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema({
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
  subject: {
    type: String,
    required: true,
  },
});

const Teacher = mongoose.model("Teacher", TeacherSchema);

module.exports = Teacher;
