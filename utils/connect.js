const mongoose = require("mongoose");

// Replace with your MongoDB connection string
const mongoURI =
  "mongodb+srv://andifab23:68YqBcqJzLv7PBu2@cluster0.4a8bw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Change 'mydatabase' to your database name

const connectDB = () => {
  return mongoose.connect(mongoURI);
};

module.exports = connectDB;
