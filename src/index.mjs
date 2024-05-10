import { connect } from "mongoose";
import express from "express";
import authRouter from "./routes/auth.mjs";
import { corsMiddleware } from "./middlewares/corsMiddleware.mjs";
import { join } from "path";
import booksRouter from "./routes/books.mjs";

// Connect to the database
try {
  await connect(process.env.MONGO_URI);
} catch (error) {
  console.error("Failed to connect to Database", error);
  process.exit(1);
}

console.log("Connected to MongoDB!");

// Create the HTTP server
const app = express();

// Global middlewares
app.use(corsMiddleware());
app.use(express.json());

// Routes
app.use("/images", express.static(join(import.meta.dirname, "..", "images")));
app.use("/api/auth", authRouter);
app.use("/api/books", booksRouter);

// Start the HTTP server
app.listen(4000, () => {
  console.log("API started on *:4000");
});
