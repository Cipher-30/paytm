const mongoose = require("mongoose");
require("dotenv").config();

const connectDb = async () => {
  await mongoose.connect(process.env.MONGODB_CONNECTION_URI)
} ;

module.exports = connectDb;