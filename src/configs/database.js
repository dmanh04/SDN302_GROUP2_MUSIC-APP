const mongoose = require("mongoose");
const config = require("./index");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.database.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    })

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.log("MongoDB connection error:", err)
    })

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected")
    })

    mongoose.connection.on("reconnected", () => {
      console.log("MongoDB reconnected")
    })

    return conn
  } catch (error) {
    console.log("Error connecting to MongoDB:", error.message)
    process.exit(1)
  }
}

const disconnectDB = async () => {
  try {
    await mongoose.connection.close()
    console.log("MongoDB connection closed")
  } catch (error) {
    console.log("Error closing MongoDB connection:", error.message)
  }
}

module.exports = { connectDB, disconnectDB }
