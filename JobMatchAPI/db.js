const mongoose = require('mongoose');

const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("connected to mongodb");
    } catch (error) {
      console.log("error while connecting mongodb", error.message);
    }
  }

module.exports = connectDB;