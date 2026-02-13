import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();

console.log("🚀 Server file started");

const app = express();

app.use(cors());
app.use(json());

app.get("/", (req, res) => {
  res.send("Backend running...");
});

console.log("🔌 Connecting to MongoDB...");

async function startServer() {
  try {
    await connectDB();
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
