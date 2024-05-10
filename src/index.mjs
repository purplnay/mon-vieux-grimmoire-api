import { connect } from "mongoose";

// Connect to the database
try {
  await connect(process.env.MONGO_URI);
} catch (error) {
  console.error("Failed to connect to Database", error);
  process.exit(1);
}

console.log("Connected to MongoDB!");
