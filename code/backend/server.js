import express, { json } from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import User from "./models/user.js";
import bcrypt from "bcryptjs";

const app = express();

app.use(cors());
app.use(json());

// serve uploaded files statically so images can be accessed by clients
app.use("/uploads", express.static("uploads"));

app.use("/api", authRoutes);

const PORT = 5000;

const createPermanentAdmin = async () => {
  try {
    // 1. Grab the credentials from the .env file
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // 2. Check if an admin with this email already exists
    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      // 3. Hash the password securely
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      // 4. Create and save the new admin
      const adminUser = new User({
        email: adminEmail,
        password: hashedPassword,
        role: "admin", // Explicitly setting the admin role
      });

      await adminUser.save();
      console.log("✅ Permanent Admin account created successfully!");
    } else {
      // If an admin already exists, just log this and move on
      console.log("⚡ Admin account already exists. Skipping creation.");
    }
  } catch (error) {
    console.error("❌ Error creating admin account:", error);
  }
};

const startServer = async () => {
  console.log("Starting server and connecting to MongoDB...");
  await connectDB();
  app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
  });
  await createPermanentAdmin();
};

startServer();