import express from "express";
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// POST APPLICATION
router.post("/", authMiddleware, upload.single("resume"), async (req, res) => {
  try {
    const { jobId } = req.body;

    // check if user has saved profile
    const user = await User.findById(req.user.id);
    if (!user.profile) return res.status(400).json({ message: "Save your profile first" });

    const existing = await Application.findOne({ job: jobId, applicant: req.user.id });
    if (existing) return res.status(400).json({ message: "Already applied" });

    const appData = { job: jobId, applicant: req.user.id };
    if (req.file) appData.resume = req.file.filename;

    const application = new Application(appData);
    await application.save();

    res.json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ALL APPLICATIONS
router.get("/", authMiddleware, async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("job")
      .populate("applicant", "-password");
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
