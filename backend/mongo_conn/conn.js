const mongoose = require("mongoose");

const conn = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL;
    
    await mongoose.connect(mongoUrl);
    console.log("Database connected.");
  } catch (error) {
    console.log("Error during mongoose connection:", error);
  }
};

conn();
