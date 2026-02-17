import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
// Routes
import authRoutes from "./Routes/auth.js";
import jobRoutes from "./Routes/jobs.js";
import Job from "./models/Job.js"; // Ensure model is registered
import User from "./models/User.js"; // Ensure model is registered
import applicationRoutes from "./Routes/application.js";
import userRoutes from "./Routes/user.js";
import profileRoutes from "./Routes/profile.js";
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// VERY IMPORTANT
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// CORS
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  }),
);

app.use((req, res, next) => {
  req.url = req.url.trim();
  req.url = req.url.replace(/%0A/g, "");
  req.url = req.url.replace(/\n/g, "");
  req.url = req.url.replace(/\r/g, "");
  next();
});

// Body parser
app.use(express.json());

// Routes
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/user", userRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/profile", profileRoutes);

// ✅ STATS API
app.get("/api/stats", async (req, res) => {
  try {
    // Dynamically import models to avoid circular dependency issues if any, 
    // though top-level import is better. 
    // Assuming models are already available or I can import them here if not imported at top.
    // Better to use the imports I'll add at the top, or just use mongoose.model if registered.
    const Job = mongoose.model("Job");
    const User = mongoose.model("User");

    // Count Jobs
    const jobCount = await Job.countDocuments();

    // Count Companies (Unique Company Names)
    const companyCount = (await Job.distinct("company")).length;

    // Count Candidates (Users with role 'employee')
    const userCount = await User.countDocuments({ role: "employee" });

    res.json({ jobs: jobCount, companies: companyCount, candidates: userCount });
  } catch (err) {
    console.error("Stats Error:", err);
    res.status(500).json({ message: "Error fetching stats" });
  }
});



// MongoDB
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/jobportal";

mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
