import { connect } from "mongoose";
import express from "express";

// Connect to the database
try {
  await connect(process.env.MONGO_URI);
} catch (error) {
  console.error("Failed to connect to Database", error);
  process.exit(1);
}

console.log("Connected to MongoDB!");

// Setup the HTTP server
const app = express();

// Start the HTTP server
app.listen(4000, () => {
  console.log("API started on *:4000");
});
